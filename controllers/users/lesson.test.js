// Тести Jest
// Runner - сама ця бібліотека. Яким чином запускає тести
// Reporter - дивитись в кінці тесту які файли були протестовані, скільки тестів було зроблено/пройшло/не пройшло
// Matches - Якщо пишеш expect, щось очікуєте
// SPY - дивитись скільки разів ф-я викликалась, чи з якими параметрами вона викликалась
// Mock - це підміна ф-ції для виконання тесту
// Coverage - покриття тестів

// Базові ф-ції для роботи з Jest
describe(title, cb); // описуємо групу тестів
beforeEach(cb); // Виконати cb перед кожним тестом
afterEach(cb); // Виконати cb після кожного тесту
beforeAll(cb); // Виконати cb перед групою тестів
afterAll(cb); // Виконати cb після групи тестів
test(title, cb); // тест
// або
it(title, cb); // тест

// Основні методи Expect, які підтримує Jest (інші - див. документацію).
expect(result).toBe(actual); // Порівняння ===
expect(func(arg)).toBe(value); // перевірка на строгу рівність отриманого значення value

expect(result).toEqual(actual); // Порівняння об'єктів (не порівнює undefined)
expect(func(arg)).toEqual(value); // глибоке порівняння якщо повертаються значення об'єкт

expect(result).toStrictEqual(actual); // Повне порівняння об'єктів (порівнює undefined)
expect(result).not.toBe(actual); // Логічне НЕ. Інвертує наступне порівняння в ланцюжку.
expect(() => fn()).toThrow(errorMessage); // Перевіряємо викидання помилки

expect(result).toMatchInlineSnapshot(); // снапшот у рядку
expect(result).toMatchSnapshot; // снапшот в окремій теці

expect(func(arg)).toBeTruthy(); // перевіряє значення на те, що чи можна значення, що повертається вважати істинним
expect(func(arg)).toBeNull(); // перевіряє значення на рівність null.
expect(func(arg)).toBeUndefined(); // перевіряє значення на undefined
expect(func(arg)).toBeDefined(); // перевіряє, що функція повертає щось

it.skip(); // пропустити тест у файлі
it.only(); // лише цей тест у файлі

// Запуск тестів:
// > jest
// > jest --coverage
// > jest --watch
