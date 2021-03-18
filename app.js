const SearchButton = document.getElementById('meal-search');
const mealInput = document.querySelector('.meal_search_input');

SearchButton.addEventListener('click', loadMeal);
mealInput.addEventListener('keypress', event => { if (event.charCode === 13) loadMeal(); });

function loadMeal() {
    const mealAPI = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealInput.value}`;
    fetch(mealAPI)
        .then(res => res.json())
        .then(data => displayMeal(data.meals));

    function displayMeal(meals) {
        const mealContainer = document.querySelector('.meal_cards');
        const noMealFound = document.querySelector('.meal_not_found');
        const mealDescriptionContainer = document.querySelector('.meal_description_box');

        mealContainer.innerHTML = '';
        noMealFound.innerText = '';
        mealDescriptionContainer.innerHTML = '';

        if (meals) {
            meals.forEach(meal => {
                const mealItem = document.createElement('div');
                mealItem.setAttribute('class', 'meal_card');
                mealItem.innerHTML = `
                    <div class="meal_img_box">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal_img img-cover-fit">
                    </div>
                    <div class="meal_content">
                        <h2 class="meal_title">${meal.strMeal}</h2>
                    </div>
                `;
                mealContainer.appendChild(mealItem);
            });
            loadMealDescription();
        }
        else noMealFound.innerText = `Sorry, meal not found for "${mealInput.value}".`;
    }
}

function loadMealDescription() {
    const mealCards = document.querySelectorAll('.meal_card');
    mealCards.forEach(meal => {
        meal.addEventListener('click', function () {
            const mealDescriptionAPI = `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal.innerText}`;
            fetch(mealDescriptionAPI)
                .then(res => res.json())
                .then(data => displayMealDescription(data.meals[0]));
        });
    });
}

function displayMealDescription(meal) {
    const mealDescriptionContainer = document.querySelector('.meal_description_box');
    const mealDescription = document.createElement('div');
    mealDescription.setAttribute('class', 'meal_description');
    mealDescription.innerHTML = `
        <div class="meal_description_img-box">
            <button class="meal_description_close">&times;</button>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal_description_img img-cover-fit">
        </div>
        <div class="meal_description_content">
            <h2 class="meal_description_title">${meal.strMeal}</h2>
            <h3 class="meal_description_subtitle">Ingredients</h3>
            <ul class="meal_description_list"></ul>
        </div>
    `;
    mealDescriptionContainer.innerHTML = '';
    mealDescriptionContainer.appendChild(mealDescription);
    const mealDescriptionList = document.querySelector('.meal_description_list');

    for (let i = 1; i <= 20; i++) {
        if (meal['strIngredient' + i]) {
            const ingredient = document.createElement('li');
            ingredient.setAttribute('class', 'meal_description_item');
            ingredient.innerText = `${meal['strMeasure' + i]} ${meal['strIngredient' + i]}`;
            mealDescriptionList.appendChild(ingredient);
        }
    }
    mealDescriptionContainer.style.visibility = 'visible';
    mealDescriptionContainer.style.opacity = '1';

    const mealDescriptionCloeBtn = document.querySelector('.meal_description_close');

    mealDescriptionCloeBtn.addEventListener('click', () => {
        const mealDescriptionContainer = document.querySelector('.meal_description_box');
        mealDescriptionContainer.style.opacity = '0';
        mealDescriptionContainer.style.visibility = 'hidden';
    });
}