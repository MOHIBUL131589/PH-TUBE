function getTimeString(time){
    const hour = parseInt(time/3600);
    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond % 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} hour ${minute} minute ${remainingSecond} second ago`
}

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName('category-btn');

    for(let btn of buttons){
        btn.classList.remove('active');
    }
}



const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then((result) => result.json())
        .then((data) => displayCategories(data.categories))
        .catch((error) => console.log(error))
}

const loadCategoryVideos = (id) => {
    // alert(id);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(result => result.json())
    .then((data) => {
        // sobaike active class remove korao
        removeActiveClass()

        // id er class k active korao 
        const activeBtn = document.getElementById(`btn-${id}`);
        activeBtn.classList.add('active');
        displayVideo(data.category);
    })
    .catch(error => console.log(error))

}

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('categories');
    categories.forEach((item) => {
        console.log(item);
        //Create a button
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
            <button id="btn-${item.category_id}" onclick='loadCategoryVideos(${item.category_id})' class="btn category-btn">
            ${item.category}
            </button>
        `
         
        categoryContainer.append(buttonContainer);
    });
}


const loadVideo = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(result => result.json())
        .then(data => displayVideo(data.videos))
        .catch(error => console.log(error))
}

const loadDetails = async (videoId) => {
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.video);

};

const displayDetails = (video) => {
    console.log(video);
    const detailsContainer = document.getElementById("modal-content");
    detailsContainer.innerHTML = `
        <img src=${video.thumbnail} />
        <p>${video.description}</p>
    `
    // way-1
    // document.getElementById("showModalData").click();
    // way-2
    document.getElementById("customModal").showModal();

}

const displayVideo = (videos) => {

    const videosContainer = document.getElementById('videos')
    videosContainer.innerHTML = "";

    if(videos.length == 0) {
        videosContainer.classList.remove("grid")
        videosContainer.innerHTML = `
        <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
            <img class="w-[200px] h-[200px]" src="asset/Icon.png" />
            <h2 class="text-center text-xl fond-bold">
                No Content Here in this Category.
            </h2>
        </div>
        `;
        return;
    } else {
        videosContainer.classList.add('grid');
    }

    videos.forEach((video) => {
        console.log(video)
        const card = document.createElement('div');
        card.classList = "card card-compact";
        card.innerHTML = `
        <figure class="h-[200px] relative">
            <img
            src=${video.thumbnail}
            class="h-full w-full object-cover"
            alt="Shoes" />
            ${
                video.others.posted_date?.length == 0 ? "" : 
                `<span class="absolute right-2 bottom-2 bg-black text-white rounded p-1">${getTimeString(video.others.posted_date)}</span>`
            }

        </figure>
        <div class="px-0 py-2 flex items-center gap-2">
            <div>
                <img class="w-10 h-10 object-cover rounded-full" src=${video.authors[0].profile_picture} />
            </div>
            <div>
                <h2 class="font-bold">${video.title}</h2>
                <div class="flex items-center gap-2">
                    <p class="text-gray-400">${video.authors[0].profile_name}</p>
                    ${
                        video.authors[0].verified === true ?
                         `<img class="w-7" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" />` : ""
                    }   
                </div>
                <p> <button onclick='loadDetails("${video.video_id}")' class="btn btn-error btn-sm">details</button> </p>
            </div>
            
        </div>
        `;
        videosContainer.append(card);


    })
}


document.getElementById('search-input').addEventListener("keyup", (e)=>{
    loadVideo(e.target.value)
});



loadVideo()

loadCategories()