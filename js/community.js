const API_URL = "/api/boards";
const pageSize = 10; // ✅ 한 페이지에 보여줄 게시글 수

// 페이지 로딩 시 게시글 목록 불러오기
document.addEventListener("DOMContentLoaded", () => loadBoards(0));

/* ============================= */
/*        게시판 목록 불러오기     */
/* ============================= */
let currentSort = "createdAt,desc"; // 기본값: 최신순

function setSort(sortType) {
  currentSort = sortType;
  loadBoards(0); // 정렬 변경 시 첫 페이지부터 다시 불러오기
}

async function loadBoards(page = 0) {
    const response = await fetch(`${API_URL}?page=${page}&size=10&sort=${currentSort}`);
    const data = await response.json();

    const boards = data.content;
    const totalPages = data.totalPages;
    const currentPage = data.number;

    const tableBody = document.querySelector("#board-list");
    tableBody.innerHTML = "";

    boards.forEach((board, index) => {
        const displayNumber = boards.length - index + (page * 10); // ✅ 삭제해도 번호 재정렬
        const row = `
            <tr>
                <td>${displayNumber}</td>
                <td><a href="detail.html?id=${board.id}">${board.title}</a></td>
                <td>${board.author}</td>
                <td>${board.createdAt ? board.createdAt.substring(0, 10) : ""}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    renderPagination(totalPages, currentPage);
}



/* ============================= */
/*        페이지네이션 처리        */
/* ============================= */
function renderPagination(totalPages, currentPage) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    if (currentPage > 0) {
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "이전";
        prevBtn.onclick = () => loadBoards(currentPage - 1);
        pagination.appendChild(prevBtn);
    }

    for (let i = 0; i < totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i + 1;
        if (i === currentPage) pageBtn.disabled = true;
        pageBtn.onclick = () => loadBoards(i);
        pagination.appendChild(pageBtn);
    }

    if (currentPage < totalPages - 1) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "다음";
        nextBtn.onclick = () => loadBoards(currentPage + 1);
        pagination.appendChild(nextBtn);
    }
}

/* ============================= */
/*        게시글 삭제 기능        */
/* ============================= */
async function deleteBoard(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });

    if (response.ok) {
        alert("삭제 완료");
        loadBoards(0);
    } else {
        alert("삭제 실패");
    }
}

// 검색 기능 (최신글 위쪽, 오래된 글 아래쪽, 번호는 위쪽이 큼)
async function searchBoards() {
    const type = document.querySelector("#search-type").value;
    const keyword = document.querySelector("#search-keyword").value;

    if (!keyword) {
        alert("검색어를 입력하세요!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search?type=${type}&keyword=${keyword}`, {
            credentials: "include"
        });

        if (!response.ok) throw new Error("서버 오류 발생");

        let boards = await response.json();
        const tableBody = document.querySelector("#board-list");
        tableBody.innerHTML = "";

        if (boards.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4">검색 결과가 없습니다.</td></tr>`;
            return;
        }

        // ✅ 최신 → 오래된 순으로 정렬
        boards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // ✅ 번호: 위쪽이 큰 숫자, 아래쪽이 1
        boards.forEach((board, index) => {
            const rowNumber = boards.length - index;

            const row = `
                <tr>
                    <td>${rowNumber}</td>
                    <td><a href="detail.html?id=${board.id}">${board.title}</a></td>
                    <td>${board.author}</td>
                    <td>${board.createdAt ? board.createdAt.substring(0, 10) : ""}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // ✅ 검색 시 페이지네이션 제거
        document.querySelector(".pagination").innerHTML = "";
    } catch (error) {
        console.error(error);
        alert("검색 실패: " + error.message);
    }
}



