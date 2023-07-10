const ajaxLink = "https://secret.api.site/secret-hash/rest-callback.php";
const questionsLink = "https://6490876b1e6aa71680cb6990.mockapi.io/FavoriteItems";

let popupHtml = `
  <div class="promo">
    <h1 class="rules__title title" >Хотите продолжить?</h1>
    <div class="buttons">
      <button class="da">Да</button>
      <button class="net">Нет</button>
    </div>
  </div>
`;



//Переменная регулирующая количество задаваемых вопросов
let count = 1;
//Максимальное количество вопросов
let maxCount = 3;
//Секунды таймера
let second = 120;
//Набранные баллы юзера
let points = 0;
//В эту переменную будет записываться правильный ответ рандомного вопроса
let correct = '';


let changeableContent = document.querySelector('.content');


const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


const start = () => {
  renderQuestion();
  setInterval(() => {
    let secondHtml = document.querySelector('.sec');
    if (second === 0) {
      changeableContent.innerHTML = popupHtml;
      document.querySelector('.da').onclick = restart;
      document.querySelector('.net').onclick = end;
      count = 1;
    } else {
        secondHtml.innerHTML = second;
        second--;
    }
    
  }, 1000)
}

const renderQuestion = async () => {
  //Получаю с бэка вопросы
  const qustionsResponse = await fetch(questionsLink);
  const questions = await qustionsResponse.json();

  

  if (count < maxCount + 1) {
    //получил рандомный вопрос из массива вопросов
    const randomQuestion = questions[getRandomNum(0,2)];
    
    correct = randomQuestion.correctRes;

    const randomQuestionHtml = `
    <div class="question">

    <div class="question__inner">
      <div class="quastion__title">вопрос ${count}</div>
      <div class="question__img-box">
        <img src="${randomQuestion.img}" alt="">
      </div>
      <h4 class="question__text">${randomQuestion.text}</h4>
      <ul class="question__list">


        <li class="question__item">

          <label class="question__label">
            <span class="radio-label">
              <input class="radio-input" type="radio" name="radio" value="${randomQuestion.options[0]}">
              <span class="radio"></span>
            </span>
            <span class="question__res">${randomQuestion.options[0]}</span>
          </label>

        </li>


        <li class="question__item">

          <label class="question__label">
            <span class="radio-label">
              <input class="radio-input" type="radio" name="radio" value="${randomQuestion.options[1]}">
              <span class="radio"></span>
            </span>
            <span class="question__res">${randomQuestion.options[1]}</span>
          </label>

        </li>

        <li class="question__item">

          <label class="question__label">
            <span class="radio-label">
              <input class="radio-input" type="radio" name="radio" value="${randomQuestion.options[2]}">
              <span class="radio"></span>
            </span>
            <span class="question__res">${randomQuestion.options[2]}</span>
          </label>

        </li>

        <li class="question__item">

          <label class="question__label">
            <span class="radio-label">
              <input class="radio-input" type="radio" name="radio" value="${randomQuestion.options[3]}">
              <span class="radio"></span>
            </span>
            <span class="question__res">${randomQuestion.options[3]}</span>
          </label>

        </li>


      </ul>

      <p class="time"><span class="sec"></span> сек</p>
    </div>
    
    <button class="next-question"><img src="images/next.svg" alt=""></button>        

    </div>
      `;

    //Отрендерил вопрос юзеру
    changeableContent.innerHTML = randomQuestionHtml;

    //Вешаю обработчик на кнопку "слудующий вопрос"
    document.querySelector('.next-question').onclick = () => {
      nextQuestion();
    }
    count++
  } else {
    //Когда вопросы подошли к концу рендерю ласт фрэйм
    changeableContent.innerHTML = `
    <div class="last-frame">
      <h1 class="last-frame__title rules__title">ВЫ НАБРАЛИ <br> <span class="points">${points} <br> </span> баллов</h1>
      <p class="last-frame__text">Введите свой email, чтобы принять участие в розыгрыше:</p>
      <input class="last-frame__input" type="text" name="" id="">
      <p class="confirm-text">Нажимая отправить результаты, 
        я соглашаюсь с условиями розыгрыша
      </p>
    </div>
    <button class="submit"><img src="images/submit.svg" alt=""></button>
    ` ;
    //Вещаю обработчик на кнопку для отправки результатов
    document.querySelector('.submit').onclick = submit;
  }

}

const nextQuestion = () => {
  
  let userResponse = '';
  //Перед рендерем нового вопроса пробегаюсь 
  //по всем чекбоксам и записываю в переменную то что ответил юзер
  document.querySelectorAll('.radio-input').forEach((checkbox) => {
    if (checkbox.checked) {
      userResponse = checkbox.value;
    }
  });
  //Если ответ верный, увеличиваю очки
  if (userResponse === correct) {
    points += second + 1;
  } else {
    console.log('Неправильный ответ');
  };
  //Обновляю секунды таймера
  second = 120;
  //ренндерю новый вопрос
  renderQuestion();
};

const restart = () => {
  //Обновляю секунды таймера
  second = 120;
  //ренндерю новый вопрос
  renderQuestion();
};

const end = () => {
  //Перезагружаю страницу юзера ибо ничего не придул в случае если юзер нажмет нет
  location.reload();
}


const submit = async () => {
  const userEmail = document.querySelector('.last-frame__input').value;
  document.querySelector('.last-frame__input').value = '';
  const result = {
      "rate": points,
      "email": userEmail
  };
  const response = await fetch(ajaxLink, {
    method: 'PUT',
    body: JSON.stringify(result)
  })
}

document.querySelector('.start-game').onclick = start;









