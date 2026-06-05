# 🎵 Playlist Manager

> A simple Python-based playlist management program.  
> Add, search, sort, and display your favorite songs from the terminal.

---

## 📁 Project Structure

```
playlist-manager/
├── README.md               # Project documentation
├── src/                    # Source code
│   ├── playlist.py         # Core playlist management logic
│   └── song.py             # Song data model & display
└── data/                   # Data files
    └── songs.txt           # Sample song list
```

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| ➕ Add Song | Add a song with title, artist, and duration |
| 📋 Show Playlist | Display all songs in the playlist |
| 🔍 Search Song | Search songs by keyword |
| 🔤 Sort Playlist | Sort songs alphabetically by title |

---

## 🔄 Program Flow

```mermaid
flowchart TD
    A([▶ Start]) --> B[Initialize playlist]
    B --> C[Add songs]
    C --> D{Choose action}
    D --> E[Show Playlist]
    D --> F[Search Song]
    D --> G[Sort Playlist]
    E --> H[print_song for each]
    F --> I{Keyword match?}
    I -->|Yes| J[Display result]
    I -->|No| K[No results found]
    G --> L[Sort by title A→Z]
    L --> M[Show sorted playlist]
    H --> N([⏹ End])
    J --> N
    K --> N
    M --> N
```

---

## 🏗️ Class Diagram

```mermaid
classDiagram
    class Song {
        +String title
        +String artist
        +String duration
    }

    class SongModule {
        +create_song(title, artist, duration) dict
        +print_song(song) void
    }

    class PlaylistModule {
        +List playlist
        +add_song(title, artist, duration) void
        +show_playlist() void
        +search_song(keyword) void
        +sort_playlist() void
    }

    SongModule --> Song : creates
    PlaylistModule --> SongModule : uses
    PlaylistModule o-- Song : contains
```

---

## ⚙️ Installation & Usage

### Requirements
- Python 3.x

### Run
```bash
python src/playlist.py
```

### Example Output
```
'Last Night on Earth' 추가 완료!
'One Last Kiss' 추가 완료!
'Pump Up the Volume' 추가 완료!

=== 플레이리스트 ===
🎵 [3:58] Last Night on Earth by Green Day
🎵 [5:12] One Last Kiss by Hikaru Utada
🎵 [3:30] Pump Up the Volume by PLAVE

=== 'Last' 검색 결과 ===
🎵 [3:58] Last Night on Earth by Green Day

제목 기준으로 정렬 완료!
```

---

## 🎵 Sample Songs (`data/songs.txt`)

```
Last Night on Earth - Green Day - 3:58
One Last Kiss - Hikaru Utada - 5:12
Pump Up the Volume - PLAVE - 3:30
```

---

## 🌿 Git Branch Strategy

```mermaid
gitGraph
   commit id: "초기 프로젝트 구조 생성"
   branch feature/add-search
   checkout feature/add-search
   commit id: "검색 기능 추가"
   checkout main
   merge feature/add-search id: "FF Merge"
   branch feature/add-sort
   checkout feature/add-sort
   commit id: "정렬 기능 추가"
   checkout main
   commit id: "README 업데이트"
   merge feature/add-sort id: "3-way Merge"
   branch feature/fix-display
   checkout feature/fix-display
   commit id: "곡 출력 형식 변경"
   checkout main
   commit id: "곡 출력 형식 수정"
   merge feature/fix-display id: "충돌 해결"
```

---

## 📄 License

This project is for educational purposes.
