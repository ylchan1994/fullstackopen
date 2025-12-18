import { test, expect, beforeEach, describe } from '@playwright/test'
import { bulkCreateNewBlog, createNewBlog, userLogin } from './helper'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const userNameFiled = page.getByLabel('Username:')
    const passwordField = page.getByLabel('Password:')
    await expect(userNameFiled).toBeVisible()
    await expect(passwordField).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('Username:').fill('root')
      await page.getByLabel('Password:').fill('salainen')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Superuser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('Username:').fill('something')
      await page.getByLabel('Password:').fill('wrong')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()

      const floatingMessage = page.locator('.floating-message')
      await expect(floatingMessage).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(floatingMessage).toHaveCSS('border-style', 'solid')
      await expect(floatingMessage).toHaveCSS('border-radius', '5px')
    })
  })

  describe('After logged in', () => {
    test('a new blog can be created', async ({ page }) => {
      await userLogin(page, 'root', 'salainen')

      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByLabel('title:').fill('A book title')
      await page.getByLabel('author:').fill('A book author')
      await page.getByLabel('url:').fill('A book url link')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('A book title A book author')).toBeVisible()

      const floatingMessage = page.locator('.floating-message')
      await expect(floatingMessage).toHaveCSS('color', 'rgb(0, 128, 0)')
      await expect(floatingMessage).toHaveCSS('border-style', 'solid')
      await expect(floatingMessage).toHaveCSS('border-radius', '5px')
    })

    test('like is correctly registered', async ({ page }) => {
      await userLogin(page, 'root', 'salainen')
      await createNewBlog(page, 'A book title', 'A book author', 'A book url link')

      //Start testing like
      await page.getByRole('button', { name: 'view' }).click()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.locator('.likes')).toContainText('1', { timeout: 5000 })
      await expect(page.locator('.likes')).toBeVisible()
    })

    test('User could delete their own blog', async ({ page, request }) => {
      await userLogin(page, 'root', 'salainen')
      await createNewBlog(page, 'A book title', 'A book author', 'A book url link')

      //Start testing like
      await page.getByRole('button', { name: 'view' }).click()

      page.on('dialog', async dialog => {
        await dialog.accept(); // Click OK
      });

      await page.getByRole('button', { name: 'remove' }).click()

      const deleteResponse = page.waitForResponse(async response => {
        const url = response.url()
        const method = response.request().method()
        const status = response.status()

        await expect(status).toStrictEqual(204)

        return url.includes('/api/blog-list/')
          && method === 'DELETE'
      })

      const reloadBlogList = page.waitForResponse(response => {
        return response.url().includes('/api/blog-list') && response.request().method() === 'GET'
      })

      await deleteResponse
      await reloadBlogList
      await expect(page.getByText('A book title A book author')).not.toBeVisible()
    })

    test('User can\'t view the remove for other user\'s blog', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          name: 'Test User',
          username: 'test',
          password: '123456'
        }
      })
      await userLogin(page, 'root', 'salainen')
      await createNewBlog(page, 'A book title', 'A book author', 'A book url link')

      await page.getByRole('button', { name: 'logout' }).click()
      await userLogin(page, 'test', '123456')

      //Start testing like
      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()

      await expect(page.getByText('A book title A book author')).toBeVisible()
    })

    test('Blog list are sorted according to likes', async ({ page, request }) => {
      let likesArray = []
      const loginResponse = page.waitForResponse(async response => {
        const url = response.url()
        const method = response.request().method()
        const status = response.status()
        await expect(status).toStrictEqual(200)

        return url.includes('/api/login')
          && method === 'POST'
      })

      await userLogin(page, 'root', 'salainen')
      await loginResponse
      await bulkCreateNewBlog(page, request)
      await page.getByRole('button', { name: 'logout' }).click()
      await userLogin(page, 'root', 'salainen')

      const loadBlog = page.waitForResponse(async response => {
        const url = response.url()
        const method = response.request().method()
        const status = response.status()
        await expect(status).toStrictEqual(200)
        return url.includes('/api/blog-list')
          && method === 'GET'
      })
      await loadBlog

      const viewButtons = await page.getByRole('button', { name: 'view' })
      const totalViewButtons = await viewButtons.count()

      for (let i = 0; i < totalViewButtons; i++) { await viewButtons.nth(0).click() }

      const likes = await page.locator('.likes')
      for (let i = 0; i < totalViewButtons; i++) { likesArray.push(await likes.nth(i).textContent()) }
      
      await expect(likesArray).toStrictEqual(['12like', '10like', '7like', '5like', '2like', '0like'])

    })

  })
})