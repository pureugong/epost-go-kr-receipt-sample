# 우체국(Epost) 영수증 HTML 샘플 및 파서

![Node.js CI](https://github.com/pureugong/epost-go-kr-receipt-sample/actions/workflows/test.yml/badge.svg)

이 저장소는 우체국(epost.go.kr) 모바일 영수증 HTML 샘플 파일을 포함하고 있습니다.
이 파일들은 파서(parser) 테스트 용도로 사용됩니다.

## 주요 기능 (Functions)

이 패키지는 우체국 영수증 HTML에서 데이터를 추출하기 위한 두 가지 주요 함수를 제공합니다.

### 1. `parseEpostReceipt(html)`

영수증 HTML 문자열을 받아 항목들의 리스트를 객체(Object) 배열 형태로 반환합니다.

**반환값 예시:**

```json
[
  {
    "링크": "http://epost.go.kr/e/?t1=1111111111111",
    "등기번호": "1111111111111",
    "요금": "4,000",
    "우편번호": "01234",
    "수취인": "홍*동",
    "내용": "소포 2000g/60cm 도서/서적"
  },
  ...
]
```

### 2. `parseEpostReceiptFlatten(html)`

영수증 HTML 문자열을 받아 데이터를 순서가 있는 배열(Array) 형태로 평탄화(flatten)하여 반환합니다. 
스프레드시트나 CSV 등으로 변환하기 용이한 형식입니다.

**데이터 순서:** `[내용, 등기번호, 링크, 수취인, 요금, 우편번호]`

**반환값 예시:**

```json
[
  {
    "values": [
      "소포 2000g/60cm 도서/서적",
      "1111111111111",
      "http://epost.go.kr/e/?t1=1111111111111",
      "홍*동",
      "4,000",
      "01234"
    ]
  },
  ...
]
```

## 검증 상태 (Validation Status)

<!-- TEST_RESULTS_START -->

| 파일 | 상태 | 항목 수 | S3 링크 | 최근 확인일 |
|---|---|---|---|---|
| [case_multi_1.html](test/fixtures/case_multi_1.html) | ✅ PASS | 2 | [Link](https://magicmealkits.s3.ap-northeast-1.amazonaws.com/epost-go-kr-receipt-sample/case_multi_1.html) | 2026-01-14 |
| [case_multi_2.html](test/fixtures/case_multi_2.html) | ✅ PASS | 3 | [Link](https://magicmealkits.s3.ap-northeast-1.amazonaws.com/epost-go-kr-receipt-sample/case_multi_2.html) | 2026-01-14 |
| [case_multi_3.html](test/fixtures/case_multi_3.html) | ✅ PASS | 2 | [Link](https://magicmealkits.s3.ap-northeast-1.amazonaws.com/epost-go-kr-receipt-sample/case_multi_3.html) | 2026-01-14 |

<!-- TEST_RESULTS_END -->

## 사용법 (Usage)

`src/index.js`에 포함된 함수를 사용하여 HTML 파일에서 데이터를 추출할 수 있습니다.
