# kakaopay-calendar
> 일정을 관리하는 Calendar 웹 어플리케이션 구현. 사용자는 상단의 '월/주' 별 버튼을 통해 하단 '월/주'에 대한 일정을 확인 할 수 있으며, 상단 왼쪽의 기간 선택 버튼을 통해 선택한 기간의 일정도 확인 할 수 있다.

[데모 영상보기](https://www.useloom.com/share/3edcc0798b9f438da33493aa2cacc2f7)
## Content
1. [개발 환경](#dev-spec)
2. [설치 및 실행 방법](#installation)
3. [Dependencies](#dependencies)
4. [API 명세](#api-spec)
5. [과제 요구사항](#requirement)
6. [문제 해결 전략](#solution)

<h2 id="dev-spec">
    1. 개발 환경
</h2>


#### Front-End
* Angular7
* Angular Material

#### Back-End
* NodeJS (version >= 8.9 for angular cli)
* ExpressJS
* MongoDB
---
<h2 id="installation">
    2. 설치 및 실행 방법
</h2>

### Back-End 
~~~javascript
//mongodb 설치(mac을 기준으로 brew로 설치하였습니다. windows 설치 방법과는 다를 수 있음)
$> brew install mongodb

$> cd calendar-back

//install dependency
$> npm install

//start server
$> npm start
~~~
### Front-End
~~~javascript
//angular cli 설치 (Node >= 8.9 필요)
$> npm install -g @angular/cli

$> cd calendar-front

//install dependency
$> npm install

//dev server 실행. `http://localhost:4200/`으로 접속
$> ng serve
~~~

<h2 id="dependencies">
    3.Dependencies
</h2>

|  Dependency  | version |
|--------------|---------|
| ------- FrontEnd -------|
| Angular    |   7.0.2   |
| Angular Material  | 7.0.2  |
| lodash  | ^4.17.11  |
| moment  | ^2.22.2   |
| ng-drag-drop  |  ^5.0.0 |
| rxjs  |  ~6.3.3 |
| ------- Back-End ------- |
| express  | 4.13.1  |
| mongoose | 4.5.7 |
| moment   | ^2.22.2 |
| lodash   | ^4.17.11 |

<h2 id="api-spec">
    4. API 명세
</h2>

### 4.1 Event(일정) 리스트
> event 리스트를 가져오는 API
> URL : 'GET /event/find'

#### 4.1.1 Parameter
~~~javascript
query: {
    isDeleted: false, //일정 삭제 여부
    showDate: this.showDate, //사용자가 선택한 기준 날짜
    mode: this.mode //사용자가 선택한 '월/주' 모드
},
sort: {startTime: 1} //일정의 시작 시간 기준으로 정렬
~~~
#### 4.1.2 응답 코드
|  code | status | data      |
|-------|-------|---------   |
|  200  | success | events: []| 
|  400  | bad request | Error Object(status, message) |
|  404  | not found | Error Object(status, message) |
|  500  | bad request | Error Object(status, message) |

### 4.2 Event(일정) 생성
> event 생성 API
> URL : 'POST /event'

#### 4.2.1 Parameter
~~~javascript
title: String, //이벤트의 제목
startTime: Date //이벤트 시작시간(DB내에서 조회하기 위한 용도)
endTime: Date //이벤트 종료시간(DB내에서 조회하기 위한 용도)
~~~
#### 4.2.2 응답 코드
|  code | status | data      |
|-------|-------|---------   |
|  200  | success | result: Object| 
|  400  | bad request | Error Object(status, message) |
|  409  | conflict | Error Object(status, message) |
|  404  | not found | Error Object(status, message) |
|  500  | bad request | Error Object(status, message) |

### 4.3 Event(일정) 업데이트
> event 업데이트 API
> URL : 'PUT /event'

#### 4.3.1 Parameter
~~~javascript
_id: ObjectId //업데이트 할 event를 조회하기 위한 용도
title: String //업데이트 할 제목
startTime: Date //이벤트 시작시간(DB내에서 조회하기 위한 용도)
endTime: Date //이벤트 종료시간(DB내에서 조회하기 위한 용도)
~~~

#### 4.3.2 응답 코드
|  code | status | data      |
|-------|-------|---------   |
|  200  | success | result: Object | 
|  400  | bad request | Error Object(status, message) |
|  409  | conflict | Error Object(status, message) |
|  404  | not found | Error Object(status, message) |
|  500  | bad request | Error Object(status, message) |

### 4.4 Event(일정) 삭제
> event 삭제 API
> URL : 'DELETE /event'

#### 4.4.1 Parameter
~~~javascript
_id: ObjectId //삭제 할 event를 조회하기 위한 용도
~~~
#### 4.4.2 응답 코드
|  code | status | data      |
|-------|-------|---------   |
|  200  | success | result: Object | 
|  400  | bad request | Error Object(status, message) |
|  409  | conflict | Error Object(status, message) |
|  404  | not found | Error Object(status, message) |
|  500  | bad request | Error Object(status, message) |

<h2 id="requirement">
    5. 과제 요구사항
</h2>

- SPA(Single Page Application)로 개발한다.
- 프론트엔드 구현 방법은 제한 없다. (Angular, React, Preact, Vue, jQuery...)
- UI 구현에 대한 제약은 없다.
- 서버 구현에서 언어 선택은 제약사항이 없으며, 다만 REST API로 구성한다.
- 데이타베이스는 사용에 제약 없다. (가능하면 In-memory db 사용하거나 메모리에 저장해도 무방하다.)
- 단위테스트는 필수, 통합테스트는 선택
- README.md 파일에 문제해결 전략 및 프로젝트 빌드, 실행 방법 명시

<h2 id="solution">
    6. 문제 해결 전략
</h2>

* mongo 모델은 '제목', '시작 시간', '삭제 여부'로 생성 (Event Model)
    * 종료시간은 필요하지 않다고 생각함(이벤트의 시작 시간에서 계산 할 수 있고, 또한 모든 일정은 1시간 단위이므로)
* calendar에 대한 UI는 요구사항에 맞게 개발하기 위하여 라이브러리나 프레임워크를 가져다 사용하지 않고 직접 구현
* UI는 크게 4개로 구분
    * 일정, 월/주를 컨트롤 하는 control-calendar.component
    * 컨트롤에 의한 view를 표시하는 content-calendar.component
    * 일정을 생성/수정/삭제하는 dialog-event-manage.component
    * 유효성 체크/에러 핸들링 후 메시지를 표시하는 dialog-message.component
* 날짜계산을 위해 moment.js사용
* 가장 고민했던 부분은 '일정 추가/수정 dialog에서 사용자가 선택한 시작시간과 종료시간이 1시간이 아닐 때 어떻게 처리할까' 였음
    * 이를 위해 실제로는 db에 저장하지는 않지만 시간 검증을 위한 endTime을 parameter로 받음
    * 서버에서는 (endTime - startTime) > 1 일 경우 startTime부터 1시간 단위로 이벤트를 만들어 주는 로직으로 해결
    * CREATE와 UPDATE API의 경우 비슷하지만 약간의 차이가 있는데, CREATE의 경우 1시간 이상 차이가 날경우 시간마다 이벤트를 만들어 주었으며, UPDATE의 경우 역시 1시간 단위로 이벤트를 만들고, 기존의 사용자가 선택한 이벤트는 isDeleted = false 로 처리
* Drag n Drop은 ng-drag-drop 모듈을 사용하여 해결