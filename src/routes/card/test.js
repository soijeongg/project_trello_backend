// 주어진 날짜와 시간 값
const year = 2024;
const month = 3; // JavaScript의 Date 객체는 월을 0부터 시작하기 때문에 1을 빼줍니다.
const day = 15;
const hour = 18;
const minute = 30;

// Date 객체 생성
const date = new Date(year, month - 1, day, hour, minute);

console.log(date);
// MySQL DATETIME 형식으로 변환
const datetimeFormat = date.toISOString().slice(0, 19).replace('T', ' ');

// datetimeFormat 출력
console.log(datetimeFormat);
