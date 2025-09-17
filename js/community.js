const API_URL = "/api/boards";

// 페이지 로딩 시 게시글 목록 불러오기
document.addEventListener("DOMContentLoaded", () => loadBoards(0));

/* -------------------- 게시글 목록 -------------------- */
async function loadBoards(page = 0) {
    const response = await fetch(`${API_URL}?page=${page}&size=10&sort=createdAt,desc`);
    const data = await response.json();

    const boards = data.content;
    const currentPage = data.number;  // 0부터 시작
    const pageSize = data.size;

    const tableBody = document.querySelector("#board-list");
    tableBody.innerHTML = "";

    boards.forEach((board, index) => {
        // ✅ "삭제돼도 1부터 시작" → 단순히 현재 페이지에서 1번부터 매기기
        const rowNumber = index + 1 + (currentPage * pageSize);

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

    renderPagination(data.totalPages, currentPage);
}


/* -------------------- 페이지네이션 -------------------- */
function renderPagination(totalPages, currentPage) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    // 이전 버튼
    if (currentPage > 0) {
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "이전";
        prevBtn.onclick = () => loadBoards(currentPage - 1);
        pagination.appendChild(prevBtn);
    }

    // 페이지 번호 버튼
    for (let i = 0; i < totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i + 1;
        if (i === currentPage) {
            pageBtn.disabled = true; // ✅ 현재 페이지는 비활성화
        }
        pageBtn.onclick = () => loadBoards(i);
        pagination.appendChild(pageBtn);
    }

    // 다음 버튼
    if (currentPage < totalPages - 1) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "다음";
        nextBtn.onclick = () => loadBoards(currentPage + 1);
        pagination.appendChild(nextBtn);
    }
}

/* -------------------- 글 작성 -------------------- */
async function createBoard() {
    const title = document.querySelector("#title").value;
    const content = document.querySelector("#content").value;
    const author = document.querySelector("#author").value;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, author })
    });

    if (response.ok) {
        alert("글이 등록되었습니다.");
        window.location.href = "community.html"; // 목록 페이지로 이동
    } else {
        alert("등록 실패");
    }
}

/* -------------------- 글 삭제 -------------------- */
async function deleteBoard(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });

    if (response.ok) {
        alert("삭제 완료");
        loadBoards(0); // 삭제 후 첫 페이지 다시 불러오기
    } else {
        alert("삭제 실패");
    }
}

/* -------------------- 검색 -------------------- */
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

        if (!response.ok) {
            throw new Error("서버 오류 발생");
        }

        const boards = await response.json();
        const tableBody = document.querySelector("#board-list");
        tableBody.innerHTML = "";

        if (boards.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4">검색 결과가 없습니다.</td></tr>`;
            return;
        }

        boards.forEach((board, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>   <!-- ✅ 검색 결과 번호 (1부터 시작) -->
                    <td><a href="detail.html?id=${board.id}">${board.title}</a></td>
                    <td>${board.author}</td>
                    <td>${board.createdAt ? board.createdAt.substring(0, 10) : ""}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // 검색 시 페이지네이션 제거 (필요시 구현 가능)
        document.querySelector(".pagination").innerHTML = "";
    } catch (error) {
        console.error(error);
        alert("검색 실패: " + error.message);
    }
}
