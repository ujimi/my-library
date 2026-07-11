// ==========================================
// The Archive v1.0
// script.js
// Part 1 / 3
// （保存しないで続けてね！）
// ==========================================


// ---------- 設定 ----------

const POSTS_FILE = "posts/posts.txt";

const CATEGORY_NAMES = {
    all: "The Archive",
    k: "⚔️🎹",
    o: "🍵",
    a: "☔",
    p: "🐼",
    u: "🐰",
    d: "🍡",
    x: "その他"
};


// ---------- HTML ----------

const postsContainer =
    document.getElementById("posts");

const searchInput =
    document.getElementById("search");

const sectionTitle =
    document.getElementById("section-title");

const archiveTitle =
    document.querySelector(".logo");

const postCount =
    document.getElementById("post-count");

const menuButtons =
    document.querySelectorAll(".menu-item");


// ---------- 状態 ----------

let allPosts = [];

let currentCategory = "all";

let currentKeyword = "";


// ---------- 読み込み ----------

window.addEventListener("DOMContentLoaded", async () => {

    await loadPosts();

    setupMenu();

setupArchiveTitle();
    
    setupSearch();

    render();

});


// ---------- posts.txt ----------

async function loadPosts() {

    try {

        const response =
            await fetch(POSTS_FILE);

        const text =
            await response.text();

        parsePosts(text);

    }

    catch (error) {

        console.error(error);

        postsContainer.innerHTML =
            "<p>posts.txt を読み込めませんでした。</p>";

    }

}


// ---------- 投稿解析 ----------

function parsePosts(text) {

    allPosts = [];

    const blocks =
        text
        .replace(/\r\n/g, "\n")
        .split("///");

    blocks.forEach(block => {

        let categories = ["x"];

const firstLine =
    content.split("\n")[0].trim();

const match =
    firstLine.match(/^【([a-z]+)】$/i);

if (match) {

    categories =
        match[1]
        .toLowerCase()
        .split("");

    content =
        content
        .split("\n")
        .slice(1)
        .join("\n")
        .replace(/^\s+/, "");

}

allPosts.push({

    categories,

    content

});
// ---------- 表示 ----------

function render() {

    let posts = [...allPosts];

    // カテゴリー
    if (currentCategory !== "all") {

        posts = posts.filter(post =>
            post.categories.includes(currentCategory)
        );

    }

    // 検索
    if (currentKeyword !== "") {

        posts = posts.filter(post =>
            post.content
                .toLowerCase()
                .includes(currentKeyword.toLowerCase())
        );

    }

    // 新しい投稿を上へ
    posts.reverse();

    // タイトル
    sectionTitle.textContent =
        CATEGORY_NAMES[currentCategory];

    // 件数
    postCount.textContent =
        `${posts.length} posts`;

    // リセット
    postsContainer.innerHTML = "";

    // 投稿なし
    if (posts.length === 0) {

        postsContainer.innerHTML = `

            <div class="empty">

                投稿がありません。

            </div>

        `;

        return;

    }

    // 投稿作成
    posts.forEach(post => {

        const card =
            document.createElement("article");

        card.className = "post-card";

        const text =
            escapeHtml(post.content)
            .replace(/\n/g, "<br>");

        card.innerHTML = `

            <div class="post-content">

                ${text}

            </div>

        `;

        postsContainer.appendChild(card);

    });

}



// ---------- HTMLエスケープ ----------

function escapeHtml(text) {

    return text

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
// ---------- メニュー ----------

function setupMenu() {

    menuButtons.forEach(button => {

        button.addEventListener("click", () => {

            currentCategory =
                button.dataset.category;

            menuButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            render();

        });

    });

}

// ---------- タイトルクリックで全表示 ----------

function setupArchiveTitle() {

    archiveTitle.style.cursor = "pointer";

    archiveTitle.addEventListener("click", () => {

        currentCategory = "all";

        menuButtons.forEach(button =>
            button.classList.remove("active")
        );

        sectionTitle.textContent =
            CATEGORY_NAMES.all;

        render();

    });

}

// ---------- 検索 ----------

function setupSearch() {

    searchInput.addEventListener("input", () => {

        currentKeyword =
            searchInput.value.trim();

        render();

    });

}
