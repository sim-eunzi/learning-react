# 데이터 포함시키기

애플리케이션의 값은 컴포넌트 자체가 아닌 컴포넌트를 따라 흐르는 데이터이다.

우리는 이 데이터를 로컬에서 다루고, 저장하기도 한다.  
지역 데이터가 데이터의 근원과 어긋나기 시작하면 신선함을 잃고, 신선하지 않은 데이터가 된다.

이번 장에서는 데이터의 근원으로부터 데이터를 적재하고 다루는 여러가지 기법을 살펴본다.

## 8.1 데이터 요청하기

자바스크립트에서 HTTP 요청을 수행하는 가장 유명한 방법은 fetch 이다.

fetch 함수는 프라미스를 반환하고 URL 에 대한 비동기 요청을 보낸다.

요청이 인터넷으로 전달되고 응답 정보가 돌아오기까지는 시간이 걸리는데,
응답이 도착하면 `.then(callback)`을 통해 callback 콜백에 정보가 전달된다.

이런 프라미스를 다루는 다른 방법은 `async/await`을 사용하는 방법이 있다.  
fetch는 프라미스를 반환하기 때문에 async 함수 안에서 fetch 요청을 await 할 수 있다.

### 8.1.1 요청으로 데이터 보내기

데이터를 생성할 때는 POST 요청을, 데이터를 변경할 때는 PUT 요청을 사용한다.

fetch 함수의 두 번째 인자는 HTTP 요청을 만들 때 fetch 가 사용할 옵션이 담겨 있는 객체다.

```javascript
fetch("/create/user", {
  method: "POST",
  body: JSON.stringify({ username, password, bio }),
});
```

### 8.1.2 fetch로 파일 업로드하기

파일을 업로드하려면 `multipart-formdata` 라는 다른 HTTP 요청을 보내야 한다.

이런 유형의 요청은 서버에게 요청 본문에 하나 이상의 파일이 들어가 있다고 알려준다.  
이 요청을 자바스크립트에서 만드려면 FormData 객체를 요청 본문에 넘겨야 한다.

```javascript
const formData = new FormData();
formData.append("username", "eunzi");
formData.append("fullname", "shim eunzi");
formData.append("avatar", imgFile);

fetch("/create/user", {
  method: "POST",
  body: formData,
});
```

이번에는 사용자를 만들면서 username, fullname, avatar 이미지를 formData 객체로 전달한다.

### 8.1.3 권한 요청

요청을 하기 위해 권한을 얻어야하는 경우가 있다.  
민감한 정보나, 개인정보를 얻어야 하는 경우에 권한부여 (authoriziation)이 필요하다.

추가로 서버에 POST, PUT, DELETE 요청을 보내야 하는 경우에는 거의 대부분 권한을 얻을 필요가 있다.

보통 사용자는 자신을 식별하도록 서비스가 부여한 유일한 토큰을 요청마다 덧붙여서 자기 신원을 나타낸다.

이런 토큰을 일반적으로 `Autouriziation` 헤더에 추가된다.

```javascript
fetch(`gttps://api.github.com/users/${login}`, {
  method: "GET",
  headers: {
    Authourization: `Bearer ${token}`,
  },
});
```

리액트 컴포넌트에서 외부 데이터를 가져오려면 useState 와 useEffect 훅을 함께 사용해야 한다.

useState 훅을 사용해 fetch 의 응답을 상태에 저장하고 useEffect 훅을 사용해 fetch 요청을 만든다.

예를 들어 깃헙 사용자 정보를 컴포넌트에 표시하고 싶으면 다음과 같이 코드를 작성해보자.

```javascript
import React, { useState, useEffect } from "react";

function GithubUser({ name }) {
  const [data, setData] = useState();

  useEffect(() => {
    if (!name) return;
    fetch(`https://api.github.com/users/${name}`)
      .then((response) => response.json())
      .then(setData)
      .catch(console.error);
  }, [name]);

  if (data) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
}

export default function App() {
  return <GithubUser name="sim-eunzi" />;
}
```

위 코드에서 App은 GithubUser 컴포넌트를 렌더링하고, "sim-eunzi" 에 대한 JSON 정보를 표시한다.

최초로 렌더링될 때 GithubUser는 useState 훅으로 data라는 상태변수를 준비한다.  
렌더링이 끝나면 useEffect 훅이 호출된다. 여기서 fetch 요청을 수행하고, 응답 받은 데이터를 JSON 객체로 파싱한 후, setData 함수에 넘기면 컴포넌트가 다시 렌더링되며, data에 값이 있는채로 화면이 렌더링된다.

이 useEffect 훅은 name 의 값이 변경되기 전까지는 호출되지 않는다.  
name 이 바뀐다면, 다른 사용자에 대한 정보를 깃허브에 요청해 얻을 필요가 있다.

### 8.1.4 데이터를 로컬 스토리지에 저장하기

웹 스토리지 API를 사용하면 브라우저에 데이터를 저장할 수 있다.

이때 window.localStorage 나 window.sessionStorage 객체를 사용해 데이터를 저장한다.

sessionStorage API는 데이터를 사용자 세션에만 저장한다.

탭을 닫거나 브라우저를 재시작하면 sessionStorage 에 있는 데이터는 사라지지만, localStorage 는 데이터를 제거하기 전까지는 무기한 보관한다.

브라우저 스토리지에 저장할 때는 문자열 형태로 해야한다.
이 말은 객체를 브라우저 스토리지에 저장하려면 JSON 문자열로 변환하고, 브라우저 스토리지에 읽어올 때는 JSON 문자열을 파싱해야 한다는 뜻이다.

JSON 데이터를 브라우저에 저장하고 읽어오는 작업을 처리하는 함수는 다음과 같이 작성할 수 있다.

```javascript
const loadJSON = (key) => key && JSON.parse(localStorage.getItem(key));

const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));
```

웹 스토리지로부터 데이터를 적재하거나 웹 스토리지에 데이터를 저장하거나 파싱하는 모든 작업은 동기적 작업이다.

이런 함수를 너무 자주 호출하거나 큰 데이터를 사용해 이런 함수를 호출하면 성능 문제가 생길 수 있다.

깃허브 요청에서 받은 사용자 데이터를 저장할 수도 있다.  
사용자에 대한 정보가 필요하면, 깃허브에 요청을 보내는 대신 localStorage에 저장된 데이터를 사용할 수가 있다.

GithubUser 컴포넌트에 다음과 같은 코드를 추가해보자.

```javascript
const loadJSON = (key) => key && JSON.parse(localStorage.getItem(key));
const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));

function GithubUser({ login }) {
  const [data, setData] = useState(loadJSON(`user:${login}`));

  useEffect(() => {
    if (!name) return;
    if (data.login === login) return;
    const { name, avatar_url, location } = data;
    saveJSON(`user:${login}`, {
      name,
      login,
      avatar_url,
      location,
    });
  }, [data]);

  useEffect(() => {
    if (!login) return;
    if (data && data.login === login) return;
    fetch(`https://api.github.com/users/${login}`)
      .then((response) => response.json())
      .then(setData)
      .catch(console.error);
  });

  if (data) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
}
```

GithubUser 컴포넌트는 이제 useEffect 훅을 2개 사용한다.  
첫 번째 훅은 데이터를 브라우저에 저장하는 훅으로, data의 값이 바뀔 때마다 훅이 호출된다.  
두 번째 훅은 깃허브에 사용자 데이터를 요청하는 훅이다.  
사용자에 대한 정보가 로컬에 저장되지 않으면 fetch 요청을 보내지 않는다.
data가 있고, data의 login이 동일한 프로퍼티이면 깃허브에 또 요청할 필요 없이,  
로컬 스토리지에 저장된 데이터를 사용하면 된다.

sessionStorage 와 localStorage는 웹 개발자에게 필수적인 무기다.  
오프라인에도 로컬에 저장된 데이터를 활용할 수 있고,  
불필요한 네트워크 요청을 줄임으로써 애플리케이션의 성능을 향상시킬 수 있다.

헤더에 `Cache-Control: max-age=<EXP_DATE>`를 추가함으로 HTTP가 캐시를 처리하게 해 줄 수 있다.

### 8.1.5 프라미스 상태 처리하기

HTTP 요청과 프라미스에는 3가지 상태가 있다.  
**진행 중(Pending), 성공, 실패**가 그 3가지 상태이다.

HTTP 요청을 보낼 때는 정말 이 모든 경우를 처리해야 한다.  
깃허브 컴포넌트를 수정해서 성공적인 요청 외의 경우를 렌더링하게 하자.  
요청이 진행 중이면 "Loading ... " 메세지를, 잘못된 경우에는 error의 세부정보를 표시해보자.

```javascript

```
