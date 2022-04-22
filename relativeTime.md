# Relative Time (past only)

## Usage
(Today = 2022/04/19)
```javascript
relativeTime('2000-01-01 12:00:00.000 +00:00')
// outputs: "22y ago"
```

Future dates are not supported
```javascript
relativeTime('2050-01-01 12:00:00.000 +00:00')
// outputs: ""
```
