# 리액트 상태관리

5장에서는 컴포넌트 트리를 만들었다.  
컴포넌트 트리는 프로퍼티를 통해 데이터가 흘러갈 수 있는 컴포넌트 계층 구조를 뜻한다.  
리액트 애플리케이션의 **상태**는 데이터에 의해 조종되며 변경될 수 있다.  

상태와 프로퍼티는 서로 밀접한 관계를 주고받으며, 컴포넌트의 상태가 바뀌면 상태도 바뀌어 새로 반영되도록 렌더링된다.  

## 6.1 별점 컴포넌트 만들기 

자주 쓰이는 별점 컴포넌트를 만들어보자.  
`yarn add react-icons` 를 하고, `StarRating.js` 컴포넌트를 작성해보자.   

총 5개나 10개 등 필요한 별점이 있을 수도 있기 때문에 createArray 함수를 통해 총 개수만큼 Star 컴포넌트를 만들어보자

```javascript
import React from 'react'
import { FaStar } from 'react-icons/fa'

const Star = ({ selected = false }) => (
  <FaStar color={selected ? 'red' : 'grey'}  />
)

const createArray = length => [...Array(length)]

export default function StarRating({ totalStars = 5 }) {
  return createArray(totalStars).map((n, i) => <Star key={i} />)
}
```

