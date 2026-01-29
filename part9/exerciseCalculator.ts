export type Exercise = {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
};

export type Input = {
  daily_exercises: number[];
  target: number;
};

export const exerciseCalculator = (input: Input): Exercise => {
  const calculateRating = (average: number, target: number) => {
    if (average > 1.3 * target) return 4;
    if (average > target) return 3;
    if (average > 0.9 * target) return 2;
    if (average > 0.7 * target) return 1;
    return 0;
  };

  const provideRatingDescription = (rating: number): string => {
    switch (rating) {
      case 0:
        return "You are doing badly, must improve";
      case 1:
        return "You are half way there, keep it up";
      case 2:
        return "Not too bad but could be better";
      case 3:
        return "Excellent, you have meet your target";
      case 4:
        return "Marvellous, you are outstanding and will become olympic champion soon.";
      default:
        return "Oops, something when wrong with your rating";
    }
  };

  const { daily_exercises: exercise, target } = input;

  const periodLength = exercise.length;
  const trainingDays = exercise.reduce((sum, current) => {
    if (current > 0) return sum + 1;
    return sum;
  }, 0);

  const average =
    exercise.reduce((sum, current) => sum + current, 0) / periodLength;

  const success = average >= target;
  const rating = calculateRating(average, target);
  const ratingDescription = provideRatingDescription(rating);
  const exerciseResult = {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };

  return exerciseResult;
};

const parseExerciseInput = (args: string[]): Input => {
  const [_node, _file, target, ...exercise] = args;
  let numberExercises: number[];

  try {
    numberExercises = exercise.map((e) => {
      const test = Number(e);
      if (isNaN(test)) throw new Error("Exercise hour contain non number");
      return test;
    });

    if (isNaN(Number(target))) throw new Error("Target is not a number");
  } catch (error) {
    let errorMessage: string = "Unexpected Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
  return { daily_exercises: numberExercises, target: Number(target) };
};

try {
  const inputs = parseExerciseInput(process.argv);
  exerciseCalculator(inputs);
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
