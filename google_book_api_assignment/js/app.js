
const  model = {
    apiUrl : 'https://www.googleapis.com/books/v1/volumes', 
    keywork : 'javascript',
    currentBook: {},
    books: []
}

const controller = {
    init: function () {
        bookListView.init();
        bookView.init();
        bookSearchView.init();
        this.retrieveBookFromAPI();
    },
    retrieveBookFromAPI: function (startIndex = 0) {
        fetch(`${model.apiUrl}?q=${model.keywork}&startIndex=${startIndex}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (books) {
                model.books = books.items;
                model.currentBook = books.items[0];
                bookListView.render();
                bookView.render();
            });
    },
    getBooks: function () {
        return model.books;
    },

    getCurrentBook: function () {
        return model.currentBook;
    },
    setCurrentBook: function(imageUrl){
        const books = controller.getBooks();
        for(let i = 0; i < books.length; i++) {
            if(books[i].volumeInfo.imageLinks.thumbnail === imageUrl) {
                model.currentBook = books[i]
                bookView.onClickShowDetail()
            }
        }

    }
}

const bookListView = {
    init: function () {
        this.bookList = document.getElementById('book-titles');
        this.render();
    },
    render: function () {
        const books = controller.getBooks();
        this.bookList.innerHTML = '';
        for(let i = 0; i < books.length; i++) {
            this.bookList.appendChild(this.getBookInfo(books[i]))
            this.bookList.appendChild(this.getBookImage(books[i]))
        }
        console.log(books);
    },
    getBookInfo: function (book) {
        bookTitle = document.createElement('li');
        bookTitle.textContent = book.volumeInfo.title + "(Author : " + book.volumeInfo.authors[0] + ")"
        return bookTitle;
    },
    getBookImage: function(book) {
        bookImage = document.createElement('img')
        bookImage.src = book.volumeInfo.imageLinks.thumbnail

        bookImage.addEventListener('click', function() {
            controller.setCurrentBook(book.volumeInfo.imageLinks.thumbnail)
        })
        return bookImage
    }

}

const bookView = {
    init: function(){
        this.viewport = document.getElementById('viewerCanvas');
        this.render();
    },
    render: function () {
        google.books.load();
        google.books.setOnLoadCallback(function(){
            const viewer = new google.books.DefaultViewer(bookView.viewport);
            const currentBook = controller.getCurrentBook();
            viewer.load(currentBook.id);
        });
    },
    onClickShowDetail: function() {
        const viewer = new google.books.DefaultViewer(bookView.viewport);
        const currentBook = controller.getCurrentBook();
        viewer.load(currentBook.id, function() {
            alert("Selected book ("
                + currentBook.volumeInfo.title + " by " 
                + currentBook.volumeInfo.authors[0] + ") doesn't have preview.")
        });
    },
    showAlertBox: function(message) {
        alert(message)
    }

}

const bookSearchView = {
    init: function() {
        this.btnSearch = document.getElementById('btnSearch');
        this.btnSearch.addEventListener('click', function() {
            model.keywork = document.getElementById('inputBookName').value
            controller.retrieveBookFromAPI()
        })
    }
}

controller.init();
