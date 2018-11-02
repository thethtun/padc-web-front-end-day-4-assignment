const gallaryModel = {
    images: [

    ],
    splashBaseImageSearchUrl: "http://www.splashbase.co/api/v1/images/search",
    searchKeyWork: "apple",
    splashBaseImageSourceUrl: "http://www.splashbase.co/api/v1/sources",
    currentImageUrl: "",
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    */
    getRandomArbitrary: function (min, max) {
        return Math.random() * (max - min) + min;
    }
}

const controller = {
    init: function () {
        galleryView.init()
    },
    getAllImages: function () {
        return gallaryModel.images
    },
    setCurrentImageUrl: function (imageUrl) {
        gallaryModel.currentImageUrl = imageUrl
        galleryView.renderCurrentImage()
    },
    getCurrentImageUrl: function () {
        return gallaryModel.currentImageUrl
    },
    fetchImagesFromSearchResult: function () {
        galleryView.showLoader();
        fetch(`${gallaryModel.splashBaseImageSearchUrl}?query=${gallaryModel.searchKeyWork}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (imageList) {
                for (let i = 0; i < imageList.images.length; i++) {
                    let imageVO = {
                        imageUrl: imageList.images[i].large_url,
                        thumbnailUrl: imageList.images[i].url
                    }
                    gallaryModel.images.push(imageVO)
                }

                galleryView.render()
            })
    },
    fetchImagesFromSplashBaseSources: function () {
        galleryView.showLoader();
        let sourceCount = 100;
        for (let i = gallaryModel.getRandomArbitrary(1, 100); i < sourceCount; i++) {
            fetch(`${gallaryModel.splashBaseImageSourceUrl}/${i}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (result) {
                    for (index in result.images) {
                        let imageObject = result.images[index]
                        let imageVO = {
                            imageUrl: imageObject.large_url,
                            thumbnailUrl: imageObject.url
                        }

                        gallaryModel.images.push(imageVO)

                        let images = gallaryModel.images
                        galleryView.render();
                    }
                })




        }


    }
}

const galleryView = {
    init: function () {

        this.gallaryRoot = $('.gallary')
        this.currentImage = $('.pop-up-image')
        this.loaderWrapper = $('.loader_wrapper')[0]
        document.querySelector('.gallary').addEventListener('click', function (e) {
            const currentUrl = e.target.parentNode.dataset.mainimage;
            controller.setCurrentImageUrl(currentUrl)

            this.popUpView = document.querySelector('.pop_up_view')
            this.popUpView.style.display = "block"
            this.popUpImage = document.getElementById('main_image')
            this.popUpImage.src = currentUrl
            this.popUpImage.style.display = "block"
            this.popUpView.addEventListener('click', function (e) {
                document.getElementById('main_image').style.display = "none"
                document.querySelector('.pop_up_view').style.display = "none"
            })
        })

        //$("body").scroll(this.scrollEndDetection())

        controller.fetchImagesFromSplashBaseSources()
    },
    closeImage: function () {
        $('.pop_up_view').remove();
    },
    render: function () {
        let images = controller.getAllImages()

        let htmlStr = ''
        images.forEach(function (image) {
            htmlStr += `<div class="image-holder" data-mainimage="${image.imageUrl}">
                <img id="main_image" src="${image.thumbnailUrl}" style="width: 33.33vw; height: 40vh; object-fit: cover; padding: 0; margin: 0;" />
            </div>`
        })
        this.gallaryRoot.html(htmlStr)
        this.loaderWrapper.style.display = "none"
    },
    renderCurrentImage: function () {
        this.currentImage.src = controller.getCurrentImageUrl
    },
    showLoader: function () {
        this.loaderWrapper.style.display = "block"
    },
    scrollEndDetection: function (o) {
        //visible height + pixel scrolled = total height 
        let innerHeight = $(window).innerHeight()
        let bodyHeight = $("body").height()
        let scrollTop = $(window).scrollTop()
        if (($(window).innerHeight() + $(window).scrollTop()) >= $("body").height()) {
            alert("Page End Reached.")
        }
    }
}

controller.init()

