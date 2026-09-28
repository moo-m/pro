// 1️⃣ قاموس الكلمات
const vocabulary = [
  "لغة", "العربية", "جملة", "اسمية", "فعلية",
  "اسم", "فعل", "حرف", "فائدة"
];

// 2️⃣ تحويل الجملة إلى أرقام
function vectorize(sentence) {
  const vector = new Array(vocabulary.length).fill(0);
  const words = sentence.split(" ");

  words.forEach(word => {
    const index = vocabulary.indexOf(word);
    if (index !== -1) vector[index] = 1;
  });

  return vector;
}

// 3️⃣ الأوزان (تبدأ عشوائية)
let weights = new Array(vocabulary.length).fill(0).map(() =>
  Math.random()
);

// 4️⃣ دالة التنبؤ
function predict(inputVector) {
  let sum = 0;
  for (let i = 0; i < inputVector.length; i++) {
    sum += inputVector[i] * weights[i];
  }
  return sum;
}

// 5️⃣ التدريب
function train(sentence, target) {
  const input = vectorize(sentence);
  const output = predict(input);
  const error = target - output;
  const learningRate = 0.1;

  for (let i = 0; i < weights.length; i++) {
    weights[i] += learningRate * error * input[i];
  }
}

// 6️⃣ تدريب النموذج
for (let i = 0; i < 1000; i++) {
  train("ما هي اللغة العربية", 1);
  train("ما هو الاسم", 0.5);
}