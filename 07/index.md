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