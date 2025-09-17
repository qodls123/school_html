const API_URL = "/api/boards";
const pageSize = 10; // ✅ 한 페이지에 보여줄 게시글 수

// 페이지 로딩 시 게시글 목록 불러오기
document.addEventListener("DOMContentLoaded", () => loadBoards(0));

/* ============================= */
/*        게시판 목록 불러오기     */
/* ============================= */
async function loadBoards(page = 0) {
    const response = await fetch(`${API_URL}?page=${page}&size=${pageSize}&sort=createdAt,desc`);
    const data = await response.json();

    const boards = data.content;   // ✅ 게시글 리스트
    const totalPages = data.totalPages; 
    const currentPage = data.number;    
    const totalElements = data.totalElements; // ✅ 전체 글 개수

    // 테이블 본문 채우기
    const tableBody = document.querySelector("#board-list");
    tableBody.innerHTML = "";

    boards.forEach((board, index) => {
        // ✅ 최신글이 위 → 번호는 가장 크게 시작
        const rowNumber = totalElements - (currentPage * pageSize) - index;

        const row = `
            <tr>
                <td>${rowNumber}</td>
                <td>
                    <a href="detail.html?id=${board.id}">
                        ${board.title}
                    </a>
                </td>
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

/* ============================= */
/*        검색 기능 (번호 동일)   */
/* ============================= */
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

        const boards = await response.json();
        const tableBody = document.querySelector("#board-list");
        tableBody.innerHTML = "";

        if (boards.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4">검색 결과가 없습니다.</td></tr>`;
            return;
        }

        // ✅ 글은 오래된 → 최신 (ASC)
        boards.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        boards.forEach((board, index) => {
            // ✅ 번호는 위쪽이 가장 큼
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

        document.querySelector(".pagination").innerHTML = ""; // 검색 시 페이지네이션 제거
    } catch (error) {
        console.error(error);
        alert("검색 실패: " + error.message);
    }
}


