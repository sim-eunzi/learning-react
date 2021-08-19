# JSX를 사용하는 리액트 

4장에서는 리액트가 어떻게 동작하는지 알아보면서 리액트 애플리케이션을 컴포넌트로 나눠봤다.  
createElement 함수는 리액트의 동작을 살펴보는 데 좋은 방법이지만 복잡한 트리 구조를 나타내기에 복잡하다.  
리액트를 활용해 효과적으로 일하기 위해 **JSX**라는 다른 요소를 사용한다. 

**JSX**는 자바스크립트의 JS + XML 을 합친말이다.  
자바스크립트 코드 안에서 바로 태그 기반의 구문을 써서 리액트 엘리먼트를 정의할 수 있게 해주는 확장이다.  

## 5.1 JSX로 리액트 엘리먼트 정의하기  

JSX는 속성이 붙은 복잡한 DOM 트리를 작성할 수 있는 간편한 문법을 제공한다.  

```javascript
// React Element
React.createElement(IngredientsList, {list: [...]})

// JSX
<IngredientsList list={[...]}>
```

JSX에서 데이터를 컴포넌트에 넘길때 중괄호({})로 감싸야한다.  
이렇게 중괄호로 감싼 코드를 자바스크립트 식이라고 부른다.  

### 5.1.1 JSX 팁 

- **컴포넌트 안에 컴포넌트**  
  JSX에서는 다른 컴포넌트의 자식으로 컴포넌트를 추가할 수 있다.  

  ```html
  <IngredientsList>
    <Ingredient />
    <Ingredient />
    <Ingredient />
  </IngredientsList>
  ```

- **className**  
  자바스크립트에서 class 가 예약어이므로 class 속성 대신 **className**을 사용하자. 

- **자바스크립트 식**  
  중괄호로 식을 감싸면 중괄호 안의 식을 평가해서 결과값을 사용한다.  
  예를 들어 엘리먼트 안에 title 프로퍼티 값을 출력하고 싶다면 변수를 식안에 써준다.  
  ```html
  <h1>{title}</h1>
  ```

  문자열이 아닌 다른 타입의 값도 식안에서 사용할 수 있다.  

### 5.1.2 배열을 JSX로 매핑하기  

자바스크립트 함수 안에서 JSX를 직접 사용할 수 있다. 배열을 JSX 엘리먼트로 변환해보자. 
```jsx
<ul>
  {
    props.ingredients.map((ingredient, i) => (
      <li key={i}> {ingredient} </li>
    ))
  }
</ul>
```

JSX는 깔끔하고 읽기 쉽지만, 브라우저는 JSX를 해석할 수 없다.  
다행히 브라우저가 해석할 수 있게 **바벨** 이라는 유용한 도구가 있다.  


## 5.2 바벨  

자바스크립트는 인터프리터 언어라서 브라우저가 코드 텍스트를 해석하기 때문에 컴파일할 필요가 없다.  
하지만 모든 브라우저가 최신 자바스크립트 문법나 JSX를 지원하지는 않는다.  
우리는 JSX와 최신 문법을 활용하고 싶기 때문에 **코드를 브라우저가 해석할 수 있도록 변환해 줄 수단**이 필요하다.  

바벨을 사용하는 방법은 가장 쉽게 바벨 CDN 링크를 직접 HTML에 포함시키는 것이다.  
이러면 타입이 "text/babel" 인 script 블록을 바벨이 컴파일해준다.  

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>

<script type="text/babel">
   // JSX 코드나 별도의 자바스크립트 코드 
</script>
```

## 5.3 JSX로 작성하는 레시피  
