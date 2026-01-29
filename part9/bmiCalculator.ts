type HeightWeight = {
  height: number;
  weight: number;
  bmi?: string;
};

export const calculateBmi = (height: number, weight: number): HeightWeight => {
  const bmi = weight / ((height * height) / 10000);
  const bmiDescription = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal range";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    if (bmi >= 30) return "Obese";
    return "Invalid input";
  };

  return {
    height,
    weight,
    bmi: bmiDescription(bmi),
  };
};

const parseInput = (args: string[]): HeightWeight => {
  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (!height) throw new Error("Height is not a number or 0");
  if (!weight) throw new Error("Weight is not a number or 0");

  return {
    height,
    weight,
  };
};

try {
  const inputs = parseInput(process.argv);
  const bmi = calculateBmi(inputs.height, inputs.weight);
  console.log(bmi.bmi);
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
