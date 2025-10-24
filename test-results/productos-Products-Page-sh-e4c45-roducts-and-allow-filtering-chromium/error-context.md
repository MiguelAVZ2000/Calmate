# Page snapshot

```yaml
- dialog "Unhandled Runtime Error" [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - navigation [ref=e7]:
          - button "previous" [disabled] [ref=e8]:
            - img "previous" [ref=e9]
          - button "next" [disabled] [ref=e11]:
            - img "next" [ref=e12]
          - generic [ref=e14]: 1 of 1 error
          - generic [ref=e15]:
            - text: Next.js (14.2.33) is outdated
            - link "(learn more)" [ref=e17] [cursor=pointer]:
              - /url: https://nextjs.org/docs/messages/version-staleness
        - button "Close" [ref=e18] [cursor=pointer]:
          - img [ref=e20]
      - heading "Unhandled Runtime Error" [level=1] [ref=e23]
      - paragraph [ref=e24]: "Error: currentPage is not defined"
    - generic [ref=e25]:
      - heading "Source" [level=2] [ref=e26]
      - generic [ref=e27]:
        - link "app\\productos\\page.tsx (69:23) @ currentPage" [ref=e29] [cursor=pointer]:
          - generic [ref=e30]: app\productos\page.tsx (69:23) @ currentPage
          - img [ref=e31]
        - generic [ref=e35]: "67 | } 68 | > 69 | const startIndex = (currentPage - 1) * PAGE_SIZE; | ^ 70 | const endIndex = startIndex + PAGE_SIZE - 1; 71 | queryBuilder = queryBuilder.range(startIndex, endIndex); 72 |"
      - heading "Call Stack" [level=2] [ref=e36]
      - button "Show collapsed frames" [ref=e37] [cursor=pointer]
```