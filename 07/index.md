# 훅스로 컴포넌트 개선하기 

렌더링은 리액트 애플리케이션의 심장 박동같다.  
프롭이나 상태가 바뀌면 컴포넌트 트리가 다시 렌더링되고, 최신 데이터를 사용자 인터페이스에 반영한다.  

useState, useRef, useContext 를 제외하고 성능을 개선시키는 다른 훅을 살펴보자.  

## 7.1 useEffect 소개 

컴포넌트는 단순히 사용자 인터페이스를 렌더링하는 함수일 뿐이다.  
렌더링은 앱이 처음 적재될 때 일어나고, 프롭이나 상태 값이 변경될 때도 일어난다.  

useEffect 함수는 **렌더러가 렌더링을 한 직후에 부수효과를 실행한다**는 뜻이다.  

```javascript
import React, {useEffect, useState} from 'react'

function Checkbox {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    alert(`checked : ${checked.toString()}`)
  })

  return (
    <>
      <input type="checkbox" value={checked} onChange={() => setChecked = !checked.toString()} />
      { checked ? 'checked' : 'not Checked' }
    </>
  )
}
```
 
Checkbox 라는 간단한 컴포넌트를 생각해보자.  
useState를 사용해 setChecked 로 checked 값을 설정한다.  
사용자가 checked 값이 바뀔때마다 alert 를 띄워주고 싶으면 위 코드처럼 `useEffect` 함수 안에다가 작성해준다. 

즉 useEffect 는 렌더링이 끝난 다음에 발생하는 함수라고 생각하자.  
렌더가 시작되면 컴포넌트 안에서 현재 상태 값에 접근할 수 있고, 이 값을 사용해 다른 일을 할 수 있다.  
그 후 렌더링이 다시 시작되면 모든 일이 처음부터 다시 발생한다.  

### 7.1.1 의존 관계 배열  

useEffect 는 useState 나 useReducer 등의 다른 상태가 있는 훅스와 함께 작동하도록 설계됐다.  

```javascript
import React, { useState, useEffect } from 'react'

function App() {
  const [val, set] = useState('')
  const [phrase, setPhrase] = useState('example phrase')

  const createPhrase = () => {
    setPhrase(val)
    set('')
  }

  useEffect(() => {
    console.log(`typing ${val} ... `)
  })

  useEffect(() => {
    console.log(`typing ${phrase} ... `)
  })

  return (
    <>
      <label>Favorite phrase</label>
      <input
        value={val}
        placeholder={phrase}
        onChange={e=> set(e.target.value)}
      />
      <button onClick={createPhrase}>Send</button>    
    </>
  )
}

export default App
```

val 은 입력 필드 값을 표현하는 상태 변수이다.  
입력 필드가 바뀔 때마다 val도 바뀌고, 사용자가 문자를 입력할 때마다 val이 바뀌기 때문에 컴포넌트가 다시 렌더링된다.  

사용자가 send 버튼을 클릭하면 텍스트 영역의 val 이 ''로 재설정되며, 
이에 따라 텍스트 필드가 빈 필드로 설정된다.  

예상대로 작동하지만, useEffect 훅이 쓸데없이 많이 호출된다.  
렌더링이 끝날 때마다 두 useEffect 훅이 모두 호출된다..  

렌더링이 이뤄질 때마다 호출되는 것을 바라지말고, useEffect 훅을 **구체적인 데이터 변경과 연동시킬 필요가 있다.**  
이 문제를 해결하기 위해 **의존 관계 배열**을 사용한다. 의존 관계 배열은 이펙트가 호출되는 시점을 제어한다.  

```javascript
useEffect(() => {
  console.log(`typing ${val}`)
}, [val])

useEffect(() => {
  console.log(`saved pharse ${pharse}`)
}, [pharse])
```

첫번째 효과는 val 값이 바뀔때만 호출되고, 두번째 효과는 phrase 값이 변경될 때만 호출된다.  

val이나 phrase가 변경될 때마다 어떤 효과를 실행하고 싶다고 하자 
```javascript
useEffect(() => {
  console.log('either val or phrase has changed')
}, [val, phrase])
```

useEffect 의 두 번째 인자로 빈 배열을 넘길 수도 있다.  
**빈 의존 관계 배열은 초기 렌더링 직후 이펙트가 단 한 번만 호출**되게 한다.  

```javascript
useEffect(()=> {
  console.log('only once after inital render')
  return () => console.log('bye bye')
}, [])
```

이는 배열에 의존관계가 없기 때문에 초기 렌더링 직후에만 호출된다.  
초기화에 아주 유용하게 쓰일 수 있다. 또 어떤 효과가 함수를 만환하면, 컴포넌트가 제거될 때 이 함수를 호출한다.  

이러한 패턴은 여러 상황에서 유리한데,  
첫 번째 렌더링시 뉴스 피드를 구독하고, 정리 함수에서는 구독을 취소하는 코드를 작성해보자.  

```javascript
export default function NewsFeed() {
  const [posts, setPosts] = useState([])
  const addPost = post => setPosts(allPosts => [post, ...allPosts])

  useEffect(() => {
    newsFeed.subscribe(addPost) // 구독하기 
    welcomeChime.play()          // 벨 울리기 

    return () => {
      newsFeed.unsubscribe()     // 구독취소
      goodbyeChime.play()        // 취소벨 울리기  
    }
  })
}
```

이 코드의 useEffect 에서는 아주 많은 일이 벌어지는데,  
뉴스 피드 이벤트와 벨소리 관련 이벤트에 대해서 서로 다른 useEffect를 사용하기를 원할 수도 있다.  

기능을 여러 useEffect로 나눠 담는 것은 좋은 생각이고, 이 기능을 좀 더 개선해보자.  
뉴스 피드를 구독하면서 뉴스를 구독할 때와 뉴스를 구독 취소할때, 그리고 새로운 뉴스가 도착할 때 서로 다른 소리를 내는 것이다.  
이런 경우가 바로 커스텀 훅을 도입할 때다.  

```javascript 
const useJazzyNews = () => {
  const [posts, setPosts] = useState([])
  const addPost = post => setPosts(allPosts => [post, ...allPosts])

  useEffect(() => {
    newsFeed.subscribe(addPost)
    return () => newsFeed.unsubscribe()
  }, [])

  useEffect(() => {
    welcomeChime.play()
    return () => goodbyeChime.play()
  }, [])

  return posts
}
```

이 커스텀 훅에는 뉴스 피드를 처리하는 모든 기능이 들어있다.  
또 다른 컴포넌트와 쉽게 공유할 수 있다는 뜻이다.  

### useMemo 훅   

`useMemo` 훅은 메모화된 값을 계산하는 함수를 호출한다.  
메모화는 성능을 향상시키기 위한 기법으로, 함수 호출 결과를 저장하고 캐시한다.  
그 후 같은 입력이 들어오면 캐시된 값을 반환한다.  

useMemo는 우리가 전달한 함수를 사용해 메모화할 값을 계산함으로써 작동한다.  
useMemo는 의존 관계가 바뀐 경우에만 이 값을 재계산한다.  
useMemo도 useEffect와 마찬가지로 의존 관계 배열에 의존한다.  

```javascript
function WordCount({ children = '' }) {
  useAnyKeyToRender()
  const words = useMemo(() => children.split(''), [children])
  useEffect(() => {
    console.log('fresh render')
  }, [words])
}
```

words 배열은 children 프로퍼티에 의존하고, children이 바뀌면 그에 맞춰 words의 값도 재계산 해야한다.   
이 코드에서 useMemo는 컴포넌트가 최초로 렌더링 될 때와 children 프로퍼티가 바뀔 때 words를 다시 계산한다.  


`useCallback` 도 useMemo와 비슷하게 사용할 수 있다.  
하지만 useCallback은 값 대신 함수를 메모화한다.  

```javascript
const fn = useCallback(() => {
  console.log('hello')
  console.log('world')
}, [])

useEffect(() => {
  console.log('fresh render')
  fn()
}, [fn])
```

useCallback은 fn의 함수값을 메모화한다.  

### 7.1.3 useLayoutEffect 를 사용해야 하는 경우  

useEffect의 효과가 발생하기 전에 항상 렌더링이 이뤄진다는 사실을 알아봤다.  
렌더링이 먼저 일어나고, 렌더링된 모든 값에 접근할 수 있는 상태에서 효과가 순서대로 발생한다.  

useLayouEffect는 렌더링 사이클의 특정 순간에 호출되는데, 이벤트가 발생하는 순서는 다음과 같다.  

(1) 렌더링   
(2) useLayoutEffect 호출  
(3) 브라우저의 화면 그리기 : 이 시점에 컴포넌트에 해당하는 엘리먼트가 실제로 DOM에 추가됨   
(4) useEffect 호출

```javascript
import React, { useEffect, useLayoutEffect } from 'react'

function App() {
  useEffect(() => console.log('useEffect'))
  useLayoutEffect(() => console.log('useLayoutEffect'))
  return <div>Ready</div>
}
```

App 컴포넌트에서는 useEffect 가 첫번째 훅이고, 그 후 useLayoutEffect 가 발생한다.  
하지만 로그를 보면 useLayoutEffect 가 useEffect 보다 먼저 발생했음을 알 수 있다. 

useLayoutEffect 는 브라우저가 **변경 내역을 화면에 그리기 전에 호출된다**  
예를 들어 창의 크기가 바뀐 경우, 엘리먼트의 너비와 높이를 얻고 싶을 수 있다.  

```javascript
function useWindowSize {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const resize = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', resize)
    resize()
    return () => window.removeEventListener('resize', resize)
  }, [])

  return [width, height]
}
```

창의 width, height는 브라우저가 화면을 그리기 전에 컴포넌트에 필요한 정보다.  
useLayoutEffect 를 사용해서 화면을 그리기 전에 창의 width, height를 계산한다.  

### 7.1.4 훅스의 규칙 

훅스를 사용할 때는 버그나 예기치 못한 동작을 방지하기 위해 염두에 둬야 하는 몇가지 규칙이 있다.  

(1) **훅스는 컴포넌트 영역 안에서만 작동한다.**  

(2) **기능을 여러 훅으로 나누면 좋다.**  

(3) **최상위 수준에서만 호출을 해야한다.**   
조건문이나 루프, 내포된 함수 안에서 훅을 사용해서는 안된다.  

### 7.1.5 useReducer 로 코드 개선하기 

Checkbox 컴포넌트를 생각해보자. 이 컴포넌트는 간단한 상태를 포함하는 컴포넌트의 완벽한 예다.  
박스는 체크된 상태이거나 체크되지 않은 상태다.  
checked가 상태 값, setChecked가 상태를 변경하는 함수다.  

```javascript
function Checkbox() {
  const [checked, setChecked] = useState(false)

  return (
    <>
      <input type="checkbox" value={checked} onChange={() => setChecked(checked => !checked)} />
      {checked ? "checked" : "not checked"} 
    </>
  )
}
```

위 코드는 잘 작동하지만 한 군데 위험해 보이는 곳이 있다.  
`onChange={() => setChecked(checked => !checked)}`   
처음에는 문제가 없겠지만 checked의 현재 값을 가지고 반대값을 반환하는 함수를 보낸다.  
이 코드는 필요보다 너무 복잡하고, 잘못된 경우가 생길 가능성이 많다.  
checked를 처리하는 대신 toggle과 같은 함수를 제공하면 어떨까?  

```javascript
function Checkbox() {
  const [checked, setChecked] = useState(false)

  function toggle() {
    setChecked(checked => !checked)
  }

  return (
    <>
      <input type="checkbox" value={checked} onChange={toggle} />
      {checked ? "checked" : "not checked"} 
    </>
  )
}
```
위 코드처럼 예측 가능한 값인 toggle로 설정된다.  
`setChecked(checked => !checked)` 를 이제는 **리듀서** 라는 다른 이름으로 부를 것이다.  

리듀서 함수는 **현재 상태를 받아서 새 상태를 반환하는 함수라 할 수 있다.**  
checked가 false면 이 함수는 반대 값인 true를 반환해야 한다.  
이런 동작을 하드코딩하는 대신, **리듀서 함수로 추상화해서 항상 같은 결과를 내놓게 한다.**  


이제 컴포넌트에 useState를 사용하는 대신, useReducer를 사용하자 

```javascript
function Checkbox() {
  const [checked, toggle] = useReducer(checked => !checked, false)

  return (
    <>
      <input type="checkbox" value={checked} onChange={toggle} />
      {checked ? "checked" : "not checked"} 
    </>
  )
}
```

여기서 useReducer는 리듀서 함수와, 초기 상태 false를 받는다.  
그 후 onChange 함수를 리듀서가 반환하는 두 번째 값인 toggle로 설정한다.  

이런 개념은 자바스크립트의 Array.reduce 와 닮아있다.  
즉 함수와 초깃값을 받고 한 값을 반환한다.  

```javascript
const numbers = [28, 34, 67, 68]
numbers.reduce((number, nextNumber) => number + nextNumber, 0)
```