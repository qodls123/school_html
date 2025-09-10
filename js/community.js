const API_URL = "http://localhost:10000/api/boards";

// 페이지 로딩 시 게시글 목록 불러오기
document.addEventListener("DOMContentLoaded", () => loadBoards(0));

async function loadBoards(page = 0) {
    const response = await fetch(`${API_URL}?page=${page}&size=10&sort=createdAt,desc`);
    const data = await response.json();

    const boards = data.content;   // ✅ 실제 게시글 리스트
    const totalPages = data.totalPages; // ✅ 전체 페이지 수
    const currentPage = data.number;    // ✅ 현재 페이지 (0부터 시작)

    // 테이블 본문 채우기
    const tableBody = document.querySelector("#board-list");
    tableBody.innerHTML = "";

    boards.forEach(board => {
        const row = `
            <tr>
                <td>${board.id}</td>
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

    // 페이지네이션 버튼 생성
    renderPagination(totalPages, currentPage);
}

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

async function deleteBoard(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (response.ok) {
        alert("삭제 완료");
        loadBoards(0); // 삭제 후 첫 페이지 다시 불러오기
    } else {
        alert("삭제 실패");
    }
}

// 검색 기능 (페이징 제외, 필요 시 추가 가능)
async function searchBoards() {
    const type = document.querySelector("#search-type").value;
    const keyword = document.querySelector("#search-keyword").value;

    if (!keyword) {
        alert("검색어를 입력하세요!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search?type=${type}&keyword=${keyword}`);

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

        boards.forEach(board => {
            const row = `
                <tr>
                    <td>${board.id}</td>
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
