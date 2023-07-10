const ajaxLink = "https://secret.api.site/secret-hash/rest-callback.php";
const questionsLink = "https://6490876b1e6aa71680cb6990.mockapi.io/FavoriteItems";


//Окно с подтверждением продолжить
let popupHtml = `
  <div class="promo">
    <h1 class="rules__title title" >Хотите продолжить?</h1>
    <div class="buttons">
      <button class="da">Да</button>
      <button class="net">Нет</button>
    </div>
    <p class="time2"><span class="sec2"></span> сек</p>
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
//Секунды таймера вспдывающег оокна с подтверждением
let sec2 = 10;
//Элемент в который рендерится приложение
let changeableContent = document.querySelector('.content');


const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


const start = () => {
  renderQuestion();
  setInterval(() => {
    //Элемент который транслирует секунды
    let secondHtml = document.querySelector('.sec');
    if (second === 0) {
      //Если секунды закончились ренендерю
      //всплывающее окно с подтверждением
      changeableContent.innerHTML = popupHtml;
      // startPopupTimer();
      document.querySelector('.sec2').innerHTML = sec2;
      second = 120;
      document.querySelector('.da').onclick = restart;
      document.querySelector('.net').onclick = end;
      count = 1;
    } else {
        if (document.querySelector('.sec') != null) {
          secondHtml.innerHTML = second;
          second--;
        } else {
          if (sec2 == 0) {
            //Если таймер всплывающего окна равен 0 то
            //Отобразить постер...
            location.reload();
            sec2 = 10;    //Обновляю секунды таймера всплывающего окна
          } else {
          
            sec2--;
            document.querySelector('.sec2').innerHTML = sec2;
          }
        }
        
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
    //Сохранил правильный ответ текущего вопроса
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
      <h1 class="last-frame__title rules__title">ВЫ НАБРАЛИ <br> <span class="points">${points} <br> </span> ${getDeclination(points)}</h1>
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
  //Cравниваю правльный ответ вопроса записанный в переменную correct ранее
  //Если ответ верный, увеличиваю очки
  if (userResponse === correct) {
    //Прибавляю к очкам 1 бал + ставшиеся секунды
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
  //Обнуляю баллы
  points = 0;
  //ренндерю новый вопрос
  renderQuestion();
};

const end = () => {
  //Перезагружаю страницу юзера ибо ничего не придумал в случае если юзер нажмет нет
  location.reload();
}

//Отправка  результатов
const submit = async () => {
  //Сохранил имэил введенный пользователем
  const userEmail = document.querySelector('.last-frame__input').value;
  document.querySelector('.last-frame__input').value = '';
  const result = {
      "rate": points,
      "email": userEmail
  };
  const response = await fetch(ajaxLink, {
    method: 'PUT',
    body: result
  });
  
}

//Функция которая подбирает корректное склонение
const getDeclination = (number) => {
  let numberString = String(number);
  const penultimateDigit = numberString[numberString.length - 2];
  const lastDigit = numberString[numberString.length - 1];
  if (penultimateDigit == 1 || lastDigit == 0) {
    return 'БАЛЛОВ'
  }
  else if (lastDigit == 1 && penultimateDigit != 1) {
    return 'БАЛЛ'
  }
  else if (lastDigit > 1 && lastDigit < 5) {
    return 'БАЛЛА'
  } else {
    return 'БАЛЛОВ'
  }
  
};



document.querySelector('.start-game').onclick = start;









