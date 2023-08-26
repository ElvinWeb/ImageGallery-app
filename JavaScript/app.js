const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-field");
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".modal-close");
const downloadModalImg = document.querySelector(".modal-import");

//API key , paginations , searchTerm varaibles
const ApiKey = `33vQVDUVWjQ87T9dWfcXR8amuqYoz2dsYCJSX4QUqZb7tE7iR4leucDO`;
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgUrl) => {
  //converting the recieved image to blob object , creating its download link , and download it
  fetch(imgUrl)
    .then((res) => res.blob())
    .then((file) => {
      console.log(file);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch((err) => console.log("Failed to download the image"));
};

//add the class and show modal , setting the image name and url
const showLightBox = (name, img) => {
  lightBox.querySelector(".modal-img").src = img;
  lightBox.querySelector(".modal-name").textContent = name;
  downloadModalImg.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.classList.add("hidden");
};
//remove the class and hide modal
const hideLightBox = () => {
  lightBox.classList.remove("show");
  document.body.classList.remove("hidden");
};

//adding the image card to the images container and make dynamic
const generateHtml = (images) => {
  imagesWrapper.innerHTML += images
    .map(
      (img) => `
  <li class="card" onclick="showLightBox('${img.photographer}','${img.src.large2x}')">
    <img src=${img.src.large2x} alt="" />
    <div class="details">
        <div class="photographer">
          <i class="uil uil-camera"></i>
          <span>${img.photographer}</span>
        </div>
          <button onclick="downloadImg('${img.src.large2x}'); event.stopPropagation();">
            <i class="uil uil-import"></i>
          </button>
    </div>
</li> `
    )
    .join("");
};

const getImages = (apiUrl) => {
  loadMoreBtn.textContent = "Loading...";
  loadMoreBtn.classList.add("disabled");
  //Fetching the images by API call with Authorization headers
  fetch(apiUrl, {
    headers: { Authorization: ApiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generateHtml(data.photos);
      loadMoreBtn.textContent = "Load more";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images!!"));
};

const loadMoreImages = () => {
  currentPage++; //increase the current page by one
  //if the searchTerm has some value then call API with search terms else the call default API
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

const loadSearchImages = (e) => {
  // If the search input is empty, set the search term to null and return from here
  if (e.target.value === "") return (searchTerm = null);
  if (e.key === "Enter") {
    //if pressed key is enter , update , the current page , search term and call the getImages
    currentPage = 1;
    searchTerm = e.target.value.trim();
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);
//events handlers
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightBox);
downloadModalImg.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);
