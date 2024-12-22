// Hàm hiển thị sản phẩm
function displayProducts(products) {
    let outputs = document.querySelector('.outputs');
    outputs.innerHTML = ''; // Xóa kết quả cũ

    products.forEach(product => {
        let productDiv = document.createElement('div');
        productDiv.classList.add('product');

        let image = document.createElement('img');
        image.src = product.image;

        let title = document.createElement('h3');
        title.textContent = product.title;

        let price = document.createElement('p');
        price.textContent = `Price: $${product.price.toFixed(2)}`;

        productDiv.appendChild(image);
        productDiv.appendChild(title);
        productDiv.appendChild(price);

        outputs.appendChild(productDiv);
    });
}

// Hàm tìm kiếm sản phẩm
async function searchProducts() {
    try {
        // Fetch the products from the JSON file
        const res = await fetch('products.json');
        const data = await res.json();

        // Get the search term from the search bar
        const searchTerm = document.getElementById('search').value;

        // Simulate an unsanitized query (vulnerable)
        const simulatedQuery = `SELECT * FROM products WHERE title LIKE '%${searchTerm}%' OR description LIKE '%${searchTerm}%'`;
        console.log('Simulated Query:', simulatedQuery);

        // Vulnerable filtering logic
        const results = data.filter(product =>
            product.title.includes(searchTerm) || product.description.includes(searchTerm)
        );

        // Display the results
        if (results.length > 0) {
            displayProducts(results);
        } else {
            document.querySelector('.outputs').innerHTML = '<p>No products found.</p>';
        }
    } catch (error) {
        console.error('Error fetching the API:', error);
    }
}

// Add event listener to the search button
document.getElementById('search-btn').addEventListener('click', searchProducts);


// Hàm áp dụng bộ lọc
async function applyFilters() {
    try {
        let res = await fetch("products.json");
        let data = await res.json();

        // Lấy giá trị từ bộ lọc
        let selectedCategory = document.getElementById('categories').value;
        let minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
        let maxPrice = parseFloat(document.getElementById('maxPrice').value) || 1000;
        let sortOption = document.getElementById('sort').value;

        // Lọc sản phẩm
        let filteredArray = data.filter(product => {
            let matchCategory = selectedCategory ? product.category === selectedCategory : true;
            let matchMinPrice = product.price >= minPrice;
            let matchMaxPrice = product.price <= maxPrice;

            return matchCategory && matchMinPrice && matchMaxPrice;
        });

        // Sắp xếp sản phẩm nếu được chọn
        if (sortOption === 'price-asc') {
            filteredArray.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
            filteredArray.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'rating-asc') {
            filteredArray.sort((a, b) => a.rating.rate - b.rating.rate);
        } else if (sortOption === 'rating-desc') {
            filteredArray.sort((a, b) => b.rating.rate - a.rating.rate);
        }

        displayProducts(filteredArray); // Hiển thị kết quả lọc
    } catch (error) {
        console.error("Error fetching the API:", error);
    }
}

// Thêm sự kiện cho các nút
document.getElementById('search-btn').addEventListener('click', searchProducts);
document.getElementById('apply').addEventListener('click', applyFilters);

// Tải sản phẩm mặc định khi mở trang
async function loadDefaultProducts() {
    try {
        let res = await fetch("products.json");
        let data = await res.json();

        displayProducts(data); // Hiển thị toàn bộ sản phẩm
    } catch (error) {
        console.error("Error fetching the API:", error);
    }
}

loadDefaultProducts();


let loginAttempts = 0; // Track failed login attempts
const maxAttempts = 5; // Maximum allowed attempts
const lockoutDuration = 15 * 60 * 1000; // Lockout duration in milliseconds (15 minutes)
let lockoutUntil = null; // Timestamp when lockout expires

document.getElementById('login-btn').addEventListener('click', function () {
    // Check if the user is currently locked out
    if (lockoutUntil && Date.now() < lockoutUntil) {
        const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000);
        document.getElementById('auth-message').innerText =
            `Too many failed attempts. Please wait ${remainingTime} seconds.`;
        return;
    }

    // Get username and password from input fields
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Reset lockout if user can retry
    if (lockoutUntil && Date.now() >= lockoutUntil) {
        loginAttempts = 0; // Reset attempts after lockout expires
        lockoutUntil = null;
    }

    // Simulated correct credentials
    const correctUsername = 'admin';
    const correctPassword = 'password123';

    // Check if the credentials are correct
    if (username === correctUsername && password === correctPassword) {
        document.getElementById('auth-message').innerText = 'Login successful!';
        loginAttempts = 0; // Reset attempts on successful login
    } else {
        loginAttempts++; // Increment failed attempts
        document.getElementById('auth-message').innerText = 'Invalid username or password!';

        // Check if the max attempts have been reached
        if (loginAttempts >= maxAttempts) {
            lockoutUntil = Date.now() + lockoutDuration; // Set lockout timer
            document.getElementById('auth-message').innerText =
                `Too many failed attempts. Please wait 15 minutes.`;
        }
    }
});
