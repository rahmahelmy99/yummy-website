

let data ;
let element;
let nameRegex=/^[a-zA-Z]+$/
let emailRegex=/^[a-zA-Z1-9]+@(gmail|yahoo).com$/
let passRegex =/[A-Za-z0-9]{8,}/
let ageRegex = /^([1-9]{1}|[1-9][0-9])$/
let phoneRegex =/^01[0 1 2 5][0-9]{8}$/

// ~ slide bar open and close
function open(){
    $(".side-bar").animate({left:"0px"},500)
    $(".open").addClass("d-none")
    $(".close").toggleClass("d-none","d-block")
    for (var i = 0; i < 5; i++){
        $(".slide-links li").eq(i).animate({top:"0px"},(i + 5)*105)
    }
    $("ul li").each(function(){
        $(this).on("click",()=>{
            $(".side-bar").animate({left:"-226px"},500)
            $(".open").addClass("d-block").removeClass("d-none")
            $(".close").addClass("d-none").removeClass("d-block")
            $("ul li").each(function(){
                $(this).animate({top:"200px"},200)
            })
        })
    })
    
}
function close(){
    $(".side-bar").animate({left:"-226px"},500)
    $(".close").addClass("d-none")
    $(".open").toggleClass("d-none","d-block")
    $("ul li").each(function(){
        $(this).animate({top:"200px"},200)
    })
}
$(".disable").on("click",function(){
    console.log("from button")
})
// ~ calling landing page
getDefaultMeals()
// ~ to call all functions
function getStart(){
    search()
    getCategories()
    getAllAreas()
    getIngerdiants()
    contactUs()
}
// ~ base api
async function getData(endPoint){
    var resopnse = await fetch(`https://www.themealdb.com/api/json/v1/1/${endPoint}`)
    data = await resopnse.json();
    return data;
}
// ~ landing page 


async function getDefaultMeals(){
    let mealsData = await getData(`search.php?s=`)
    let meals = mealsData.meals;
    displayMeals(meals,25)
    
    // console.log(mealsData);
} 
// ~ search
function search(){
    $("#search").on("click",function(event){
        $(".section").not(".search-section").removeClass("d-block").addClass("d-none")
        $(".search-section").toggleClass("d-none","d-block")
        $(".SearchByName").on("input",async ()=>{
            searchBy("s",".SearchByName")
        })
        $(".SearchByFirstL").on("input",async function(event){
                searchBy("f",".SearchByFirstL");
                // $(".SearchByFirstL").on("keypress",()=>{
            // })
            
                // console.log($(".SearchByFirstL").val().length);
            
        })
    })
}
async function searchBy(letter,inputName){
        let searchData = await getData(`search.php?${letter}=${$(inputName).val()}`)
        let meals = searchData.meals;
        // console.log(data);
        let card ="";
        // console.log(meals.length)
        for(var i=0;i< meals.length;i++){
            card +=`<div class="col-12 col-md-3">
            <div class="inner">
              <div class="card position-relative border border-0 rounded-4" id="${meals[i]?.idMeal}">
                <div
                  class="overlay d-flex justify-content-start align-items-center position-absolute start-0 end-0 bottom-0 border border-0 rounded-3"
                >
                  <span class="text-start px-3 fw-semibold fs-3 text-black"
                    >${meals[i].strMeal}</span
                  >
                </div>
                <img
                  src="${meals[i].strMealThumb}"
                  alt=""
                  class="w-100 border border-0 rounded-3"
                />
              </div>
            </div>
          </div>`
           
        }
        $(".search-section .row2").html(card)
}
// ~ category
async function getCategories(){
    $("#categories").on("click",async function(){
        let allCat = await getData("categories.php");
        // console.log(allCat)
        let cardOfCategory = "";
        
        $(".section").not(".categories-section").removeClass("d-block").addClass("d-none")
        $(".categories-section").removeClass("d-none").addClass("d-block")

        for(var i = 0; i < allCat.categories.length; i++ ){
                cardOfCategory += `
                <div class="col-12 col-md-3">
                <div class="inner">
                    <div class="card position-relative border border-0 rounded-4">
                    <div
                        class="overlay d-flex flex-column justify-content-start align-items-center position-absolute start-0 end-0 bottom-0 border border-0 rounded-3"
                    >
                        <span id="category" class="text-center px-3 fw-semibold fs-3 text-black"
                        >${allCat.categories[i].strCategory}</span>
                        <p class="text-center text-black fs-6">
                        ${allCat.categories[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}
                        </p>
                    </div>
                    <img
                        src= "${allCat.categories[i].strCategoryThumb}"
                        alt=""
                        class="w-100 border border-0 rounded-3"
                    />
                    </div>
                </div>
                </div>`;
            }
            $(".categories-section .row").html(cardOfCategory)
            $(".categories-section .row").find(".card").each(function(){
                $(this).on("click",function(){
                    getMealsByCategory($(this).find("#category").html())
                })
            })
    })
}
async function getMealsByCategory(categoryName){
    let category = await getData(`filter.php?c=${categoryName}`)
    // console.log(category)
    let meals =category.meals;
    displayMeals(meals,20)
}
// ~ area
async function getAllAreas() {
    $("#areas").on("click",async function(){
        area = await getData("list.php?a=list")
        console.log(area)
        let cardOfArea = "";

        $(".section").not(".area-section").removeClass("d-block").addClass("d-none")
        $(".area-section").toggleClass("d-none","d-block")

        for(var i=0 ; i <area.meals.length ;i++){
            cardOfArea +=`
                <div class="col-12 col-md-3">
                    <div class="inner">
                        <div class="card position-relative border border-0 rounded-4 bg-transparent d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-house-laptop fa-4x"></i>
                            <h3 id="city">${area.meals[i].strArea}</h3>
                        </div>
                    </div>
                    </div>`;
                
            }
            $(".area-section .row").html(cardOfArea);
            $(".area-section .row").find(".card").each(function(){
                $(this).on("click",async function(){
                    await getMealsByArea($(this).find("#city").html())
                })
            })
            
            })
}
async function getMealsByArea(city) {
    let area = await getData(`filter.php?a=${city}`)
    meals= area.meals
    displayMeals(meals,20)
    // console.log(area);
}
~ ingrediants
async function getIngerdiants(){
    $("#ingrediants").on("click",async ()=>{
        let ingrediantsData = await getData("list.php?i=list")
        let meals = ingrediantsData.meals;
        // let dec = `${meals[i].strDescription.split(" ").slice(0,20).join(" ")}`
        // console.log(data);
        $(".section").not(".ingrediants-section").removeClass("d-block").addClass("d-none")
        $(".ingrediants-section").toggleClass("d-none","d-block")
        let card = ``;
        
        for(var i = 0; i< 20 ;i++){
            card +=`<div class="col-12 col-md-3">
                    <div class="inner">
                        <div
                            class="card position-relative text-center border border-0 rounded-4 bg-transparent d-flex justify-content-center align-items-center"
                        >
                            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                            <h3 class="">${meals[i].strIngredient}</h3>
                            <p class="text-center">${meals[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                        </div>
                    </div>
            </div>
            `
        }
        $(".ingrediants-section .row").html(card)
        // console.log($(".ingrediants-section .container").find(".card"));
        
        $(".ingrediants-section .row").find(".card").each(function(){
            $(this).on("click",async ()=>{
                // console.log($(this).find("h3").html());
                await getByIngrediantName($(this).find("h3").html())
                
            })
        })
    })
}
async function getByIngrediantName(mealName){
    let ingrediantsData = await getData(`filter.php?i=${mealName}`)
    meals= ingrediantsData.meals
    displayMeals(meals,meals.length)
    // console.log(ingrediants);
}
// ~ display meals at any section 
async function displayMeals(meals,num){
    $(".section").not(".meals-section").removeClass("d-block").addClass("d-none")
    $(".meals-section").toggleClass("d-none","d-block")
    let card = "";
    for(var i = 0; i < num ; i++ ){
        card += `<div class="col-12 col-md-3">
                    <div class="inner">
                        <div class="card position-relative border border-0 rounded-4" id='${meals[i]?.idMeal}'">
                            <div class="overlay d-flex justify-content-start align-items-center position-absolute start-0 end-0 bottom-0 border border-0 rounded-3">
                                <span class="text-start px-3 fw-semibold fs-3 text-black">${meals[i].strMeal}</span>
                            </div>
                            <img src="${meals[i].strMealThumb}" alt="" class="w-100 border border-0 rounded-3"/>
                        </div>
                    </div>
                </div>`;
    }
    $(".meals-section .row").html(card)
    $(".meals-section .row").find(".card").each(function(){
        $(this).on("click",function(){
            getInstructions($(this).attr("id"))
            // console.log($(this).attr("id"))
        });

    })
}
// ~ instructions
async function getInstructions(id){
    let instructionsData = await getData(`lookup.php?i=${id}`)
    let meals = instructionsData.meals;
    // console.log(id);
    // console.log(data.meals[0].strTags.split(",").length);
    
    // console.log(data.meals[0])
    $(".section").not(".details-section").removeClass("d-block").addClass("d-none")
    $(".details-section").toggleClass("d-none","d-block")
    let details = "";
    let recipes = "";
    let tags = ""
    let tagsArr = "";
    tagsArr = meals[0].strTags?.split(",");
    if(!tagsArr){
        tagsArr=[]
    }
    for(var i = 0;i < 20;i++){
        if(meals[0][`strIngredient${i}`]){
            recipes += ` <div
                      class="col-auto alert alert-success p-0 m-2"
                    >
                      <p class=" m-0 p-1 flex-wrap fs-6">
                      <span class="recipe text-success">${data.meals[0][`strMeasure${i}`]}</span>
                      <span class="recipe text-success">${data.meals[0][`strIngredient${i}`]}</span></p>
                    </div>`
        }
    }
    for (var i=0 ;i < tagsArr.length;i++){
        tags = `<div
                class="col-auto alert alert-danger text-danger p-1 m-2 d-flex justify-content-center align-items-center"
                >
                    <p class="m-0 fs-6 tag text-danger">${tagsArr[i]}</p>
                </div>`;
    }

    details = `
            <div class="row d-flex flex-row bg-transparent my-5">
                <div class="col-12 col-md-4 Mealimage">
                      <div class="inner">
                        <div class="card text-white">
                            <img
                            src="${meals[0].strMealThumb}"
                            alt=""
                            class="w-100 rounded-3"
                            />
                            <h2 class="fs-2 fw-semibold">${meals[0].strMeal}</h2>
                        </div>
                      </div>
                </div>
                <div class="col-12 col-md-8 Mealcontent">
                  <div class="inner">
                        <div class="card text-white">
                        <h2 class="h2 fw-semibold">Instructions</h2>
                        <p>${meals[0].strInstructions}</p>
                        <h2 class="h3 fw-bolder">
                            Area : <span class="fw-semibold">${meals[0].strArea}</span>
                        </h2>
                        <h2 class="h3 fw-bolder">
                            Category : <span class="fw-semibold">${meals[0].strCategory}</span>
                        </h2>
                        <div class="recipe-cards">
                        <h2 class="h3 fw-semibold">Recipes :</h2>
                        <div class="row g-0">${recipes}</div>
                        </div>
                    <div class="recipe-tags my-3 pb-2">
                        <h2 class="h3 fw-semibold">Tags :</h2>
                        <div class="row g-0">${tags}</div>
                        
                    </div>
                    </div>
                    <div class="btns">
                        <a target="_blank" href="${data.meals[0].strSource}" class="btn btn-success">Source</a>
                        <a target="_blank" href="${data.meals[0].strYoutube}" class="btn btn-danger">Youtube</a>
                    </div>
                    </div>
                </div>
                </div>
            </div>`
            $(".details-section .container").html(details);
}
let nameFoucs = false;
let emailFoucs = false;
let phoneFoucs = false;
let ageFoucs = false;
let passFoucs = false;
let repassFocus = false;
function contactUs(){
    $("#contactUs").on("click",()=>{
        $(".contact-section").addClass("d-block").removeClass("d-none")
        $(".section").not(".contact-section").addClass("d-none").removeClass("d-block")
        $("#disableBtn").addClass("disabled").removeClass("enabled")
        
    })
    chaeckValidate()
    $("#disableBtn").addClass("enabled").removeClass("disabled")
}
    $("#username").on("click", () => {
        nameFoucs = true

    })
    $("#email").on("focus", () => {
        emailFoucs = true
    })
    $("#phone").on("focus", () => {
        phoneFoucs = true
    })
    $("#age").on("focus", () => {
        ageFoucs = true
    })
    $("#pass").on("focus", () => {
        passFoucs = true
    })
    $("#rePass").on("focus", () => {
        repassFocus = true
    })
    



function chaeckValidate(){
    $("#username").on("keyup",()=>{
        if(nameFoucs){
            if (inputValid(nameRegex,$("#username"))){
                console.log("valid")
                $("#nameError").removeClass("d-block").addClass("d-none")
            }else{
                console.log("not valid");
                $("#nameError").toggleClass("d-none","d-block")
            }
        }
    })

    $("#email").on("keyup",()=>{
        if(emailFoucs){
        if (inputValid(emailRegex,$("#email"))){
            console.log("valid")
            $("#emailError").removeClass("d-block").addClass("d-none")
        }else{
            console.log("not valid");
            $("#emailError").toggleClass("d-none","d-block")
        }
    
    }})
    $("#phone").on("keyup",()=>{
        if(phoneFoucs){
            if (inputValid(phoneRegex,$("#phone"))){
                console.log("valid")
                $("#phoneError").removeClass("d-block").addClass("d-none")
            }else{
                console.log("not valid");
                $("#phoneError").toggleClass("d-none","d-block")
            }
            
        }
    })
    $("#age").on("keyup",()=>{
        if(ageFoucs){
        if (inputValid(ageRegex,$("#age"))){
            console.log("valid")
            $("#ageError").removeClass("d-block").addClass("d-none")
        }else{
            console.log("not valid");
            $("#ageError").toggleClass("d-none","d-block")
        }
        
    }})
    $("#pass").on("keyup",()=>{
        if(passFoucs){
            if (inputValid(passRegex,$("#pass"))){
                console.log("valid");
                $("#passError").removeClass("d-block").addClass("d-none")
            }else{
                $("#passError").toggleClass("d-none","d-block")
                console.log("not valid");
            }
            
        }
    })
    $("#rePass").on("keyup",()=>{
        if(repassFocus){
            if (inputValid(passRegex,$("#rePass"))){
                if($("#rePass").val()== $("#pass").val()){
                    console.log("valid")
                    $("#repassError").removeClass("d-block").addClass("d-none")
                }
                else{
                    console.log("not valid");
                $("#repassError").toggleClass("d-none","d-block")
                }

            }else{
                console.log("not valid");
                $("#repassError").toggleClass("d-none","d-block")
            }
        }
    })
    // if (!(!nameFoucs && !emailFoucs && !phoneFoucs && !ageFoucs && !passFoucs && !repassFocus)) {
    //     console.log("hhhhhhhhhhhhhhhhhhhhhhhhhiiiii")
    //     $("#disableBtn").addClass("enabled").removeClass("disabled")
    // } else {
    //     $("#disableBtn").addClass("disabled").removeClass("enabled")
    // }
   

}

function inputValid(regex,element){
    if (regex.test(element.val())){
        return true;
    }else{
        return false;
    }
}


getStart()

// ! events 
$(".open").on("click",function(){
    open()
})
$(".close").on("click",function(){
   close()
})


// ~ loadding screen

