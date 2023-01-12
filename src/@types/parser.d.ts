declare enum Precendence {
  LOWEST = 1,
  EQUALS, // ==
  LESSGREATER, // < or >
  SUM, // +
  PRODUCT, // *
  PREFIX, // !X
  CALL, // func(x)
}
