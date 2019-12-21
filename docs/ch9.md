## 第 9 章 通用程序设计

## 【57】将局部变量的作用域最小化

> Minimize the scope of local variables

This item is similar in nature to Item 15, “Minimize the accessibility of classes and members.” By minimizing the scope of local variables, you increase the readability and maintainability of your code and reduce the likelihood of error.

本条目在性质上类似于 Item-15，即「最小化类和成员的可访问性」。通过最小化局部变量的范围，可以提高代码的可读性和可维护性，并降低出错的可能性。

Older programming languages, such as C, mandated that local variables must be declared at the head of a block, and some programmers continue to do this out of habit. It’s a habit worth breaking. As a gentle reminder, Java lets you declare variables anywhere a statement is legal (as does C, since C99).

较老的编程语言，如 C 语言，强制要求必须在代码块的头部声明局部变量，一些程序员出于习惯目前继续这样做。这是一个应改变的习惯。温馨提醒，Java 允许你在任何能够合法使用语句的地方声明变量（这与 C99 标准后 C 语言一样）。

**The most powerful technique for minimizing the scope of a local variable is to declare it where it is first used.** If a variable is declared before it is used, it’s just clutter—one more thing to distract the reader who is trying to figure out what the program does. By the time the variable is used, the reader might not remember the variable’s type or initial value.

**将局部变量的作用域最小化，最具说服力的方式就是在第一次使用它的地方声明。** 如果一个变量在使用之前声明了，代码会变得很混乱，这是另一件分散读者注意力的事情，因为读者正在试图弄清楚程序的功能。在使用到该变量时，读者可能不记得变量的类型或初始值。

Declaring a local variable prematurely can cause its scope not only to begin too early but also to end too late. The scope of a local variable extends from the point where it is declared to the end of the enclosing block. If a variable is declared outside of the block in which it is used, it remains visible after the program exits that block. If a variable is used accidentally before or after its region of intended use, the consequences can be disastrous.

过早地声明局部变量会导致其作用域开始得太早，而且结束得过晚。局部变量的范围应该从声明它的地方直到封闭块的末尾。如果变量在使用它的代码块外部声明，则在程序退出该块之后它仍然可见。如果一个变量在其预期使用区域之前或之后意外使用，其后果可能是灾难性的。

**Nearly every local variable declaration should contain an initializer.** If you don’t yet have enough information to initialize a variable sensibly, you should postpone the declaration until you do. One exception to this rule concerns try-catch statements. If a variable is initialized to an expression whose evaluation can throw a checked exception, the variable must be initialized inside a try block (unless the enclosing method can propagate the exception). If the value must be used outside of the try block, then it must be declared before the try block, where it cannot yet be “sensibly initialized.” For an example, see page 283.

**每个局部变量声明都应该包含一个初始化表达式。** 如果你还没有足够的信息来合理地初始化一个变量，你应该推迟声明，直到条件满足。这个规则的一个例外是 try-catch 语句。如果一个变量被初始化为一个表达式，该表达式的计算结果可以抛出一个 checked 异常，那么该变量必须在 try 块中初始化（除非所包含的方法可以传播异常）。如果该值必须在 try 块之外使用，那么它必须在 try 块之前声明，此时它还不能「合理地初始化」。例子可参见 283 页。

Loops present a special opportunity to minimize the scope of variables. The for loop, in both its traditional and for-each forms, allows you to declare loop variables, limiting their scope to the exact region where they’re needed. (This region consists of the body of the loop and the code in parentheses between the for keyword and the body.) Therefore, prefer for loops to while loops, assuming the contents of the loop variable aren’t needed after the loop terminates.

循环提供了一个特殊的机会来最小化变量的范围。for 循环的传统形式和 for-each 形式都允许声明循环变量，将它们的作用域精确限制在需要它们的区域。（这个区域由循环的主体以及 for 关键字和主体之间括号中的代码组成。）因此，假设循环结束后不再需要循环变量，for 循环就优于 while 循环。

For example, here is the preferred idiom for iterating over a collection (Item 58):

例如，下面是遍历集合的首选习惯用法（Item-58）：

```java
// Preferred idiom for iterating over a collection or array
for (Element e : c) {
    ... // Do Something with e
}
```

If you need access to the iterator, perhaps to call its remove method, the preferred idiom uses a traditional for loop in place of the for-each loop:

如果你需要访问 iterator，或者调用它的 remove 方法，首选的习惯用法是使用传统的 for 循环来代替 for-each 循环：

```java
// Idiom for iterating when you need the iterator
for (Iterator<Element> i = c.iterator(); i.hasNext(); ) {
    Element e = i.next();
    ... // Do something with e and i
}
```

To see why these for loops are preferable to a while loop, consider the following code fragment, which contains two while loops and one bug:

要弄清楚为什么 for 循环比 while 循环更好，请考虑下面的代码片段，其中包含两个 while 循环和一个 bug：

```java
Iterator<Element> i = c.iterator();
while (i.hasNext()) {
    doSomething(i.next());
}
...
Iterator<Element> i2 = c2.iterator();
while (i.hasNext()) { // BUG!
    doSomethingElse(i2.next());
}
```

The second loop contains a copy-and-paste error: it initializes a new loop variable, i2, but uses the old one, i, which is, unfortunately, still in scope. The resulting code compiles without error and runs without throwing an exception, but it does the wrong thing. Instead of iterating over c2, the second loop terminates immediately, giving the false impression that c2 is empty. Because the program errs silently, the error can remain undetected for a long time.

第二个循环包含一个复制粘贴错误：它计划初始化一个新的循环变量 i2，却误用了旧的变量 i，不幸的是，i 仍然在作用域中。生成的代码编译时没有错误，运行时没有抛出异常，但是它做了错误的事情。第二个循环并没有遍历 c2，而是立即终止，从而产生 c2 为空的假象。因为程序会静默地出错，所以很长一段时间内都无法检测到错误。

If a similar copy-and-paste error were made in conjunction with either of the for loops (for-each or traditional), the resulting code wouldn’t even compile. The element (or iterator) variable from the first loop would not be in scope in the second loop. Here’s how it looks with the traditional for loop:

如果将类似的复制粘贴错误发生在 for 循环（for-each 循环或传统循环），则生成的代码甚至无法编译。对于第二个循环，第一个循环中的（或 iterator）变量已经不在作用域中。下面是它与传统 for 循环的样子：

```java
for (Iterator<Element> i = c.iterator(); i.hasNext(); ) {
Element e = i.next();
... // Do something with e and i
}
...
// Compile-time error - cannot find symbol i
for (Iterator<Element> i2 = c2.iterator(); i.hasNext(); ) {
Element e2 = i2.next();
... // Do something with e2 and i2
}
```

Moreover, if you use a for loop, it’s much less likely that you’ll make the copy-and-paste error because there’s no incentive to use different variable names in the two loops. The loops are completely independent, so there’s no harm in reusing the element (or iterator) variable name. In fact, it’s often stylish to do so. The for loop has one more advantage over the while loop: it is shorter, which enhances readability. Here is another loop idiom that minimizes the scope of local variables:

此外，如果你使用 for 循环，那么发生复制粘贴错误的可能性要小得多，因为这两种循环中没有使用不同变量名称的动机。循环是完全独立的，所以重用循环（或 iterator）变量名没有害处。事实上，这样做通常很流行。for 循环相比 while 循环还有一个优点：它更短，这增强了可读性。下面是另一个循环习惯用法，它也最小化了局部变量的范围：

```java
for (int i = 0, n = expensiveComputation(); i < n; i++) {
    ... // Do something with i;
}
```

The important thing to notice about this idiom is that it has two loop variables, i and n, both of which have exactly the right scope. The second variable, n, is used to store the limit of the first, thus avoiding the cost of a redundant computation in every iteration. As a rule, you should use this idiom if the loop test involves a method invocation that is guaranteed to return the same result on each iteration.

关于这个用法需要注意的重要一点是，它有两个循环变量，i 和 n，它们都具有完全正确的作用域。第二个变量 n 用于存储第一个变量的极限，从而避免了每次迭代中冗余计算的成本。作为一个规则，如果循环测试涉及一个方法调用，并且保证在每次迭代中返回相同的结果，那么应该使用这个习惯用法。

A final technique to minimize the scope of local variables is to keep methods small and focused. If you combine two activities in the same method, local variables relevant to one activity may be in the scope of the code performing the other activity. To prevent this from happening, simply separate the method into two: one for each activity.

最小化局部变量范围的最后一种技术是保持方法小而集中。如果在同一方法中合并两个操作，与一个操作相关的局部变量可能位于执行另一个操作的代码的范围内。为了防止这种情况发生，只需将方法分成两个部分：每个操作一个。

---

## 【58】for-each 循环优于传统的 for 循环

> Prefer for-each loops to traditional for loops

As discussed in Item 45, some tasks are best accomplished with streams, others with iteration. Here is a traditional for loop to iterate over a collection:

正如在 Item-45 中所讨论的，一些任务最好使用流来完成，其他任务最好使用 iteration。下面是使用一个传统的 for 循环来遍历一个集合：

```java
// Not the best way to iterate over a collection!
for (Iterator<Element> i = c.iterator(); i.hasNext(); ) {
    Element e = i.next();
    ... // Do something with e
}
```

and here is a traditional for loop to iterate over an array:

这是使用传统的 for 循环来遍历数组：

```java
// Not the best way to iterate over an array!
for (int i = 0; i < a.length; i++) {
    ... // Do something with a[i]
}
```

These idioms are better than while loops (Item 57), but they aren’t perfect. The iterator and the index variables are both just clutter—all you need are the elements. Furthermore, they represent opportunities for error. The iterator occurs three times in each loop and the index variable four, which gives you many chances to use the wrong variable. If you do, there is no guarantee that the compiler will catch the problem. Finally, the two loops are quite different, drawing unnecessary attention to the type of the container and adding a (minor) hassle to changing that type.

这些习惯用法比 while 循环更好（Item-57），但是它们并不完美。迭代器和索引变量都很混乱（你只需要元素）。此外，它们有出错的可能。迭代器在每个循环中出现三次，索引变量出现四次，这使得有很多机会使用到错误的变量。如果这样做，就不能保证编译器会捕捉到问题。Finally, the two loops are quite different, drawing unnecessary attention to the type of the container and adding a (minor) hassle to changing that type.

The for-each loop (officially known as the “enhanced for statement”) solves all of these problems. It gets rid of the clutter and the opportunity for error by hiding the iterator or index variable. The resulting idiom applies equally to collections and arrays, easing the process of switching the implementation type of a container from one to the other:

for-each 循环（官方称为「enhanced for 语句」）解决了所有这些问题。它通过隐藏迭代器或索引变量来消除混乱和出错的机会。由此产生的习惯用法同样适用于集合和数组，从而简化了将容器的实现类型从一种转换为另一种的过程：

```java
// The preferred idiom for iterating over collections and arrays
for (Element e : elements) {
    ... // Do something with e
}
```

When you see the colon (:), read it as “in.” Thus, the loop above reads as “for each element e in elements.” There is no performance penalty for using for-each loops, even for arrays: the code they generate is essentially identical to the code you would write by hand.

当你看到冒号 `(:)` 时，请将其读作「in」。因此，上面的循环读作「对元素集的每个元素 e 进行操作」。使用 for-each 循环不会降低性能，对于数组也是如此：它们生成的代码本质上与你手工编写的 for 循环代码相同。

The advantages of the for-each loop over the traditional for loop are even greater when it comes to nested iteration. Here is a common mistake that people make when doing nested iteration:

当涉及到嵌套迭代时，for-each 循环相对于传统 for 循环的优势甚至更大。下面是人们在进行嵌套迭代时经常犯的一个错误：

```java
// Can you spot the bug?
enum Suit { CLUB, DIAMOND, HEART, SPADE }
enum Rank { ACE, DEUCE, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT,NINE, TEN, JACK, QUEEN, KING }
...
static Collection<Suit> suits = Arrays.asList(Suit.values());
static Collection<Rank> ranks = Arrays.asList(Rank.values());
List<Card> deck = new ArrayList<>();
for (Iterator<Suit> i = suits.iterator(); i.hasNext(); )
for (Iterator<Rank> j = ranks.iterator(); j.hasNext(); )
deck.add(new Card(i.next(), j.next()));
```

Don’t feel bad if you didn’t spot the bug. Many expert programmers have made this mistake at one time or another. The problem is that the next method is called too many times on the iterator for the outer collection (suits). It should be called from the outer loop so that it is called once per suit, but instead it is called from the inner loop, so it is called once per card. After you run out of suits, the loop throws a NoSuchElementException.

如果你没有发现这个 bug，不要感到难过。许多专业程序员都曾犯过这样的错误。问题是，迭代器对外部的集合 suits 调用了太多次 next 方法。它应该从外部循环调用，因此每种花色调用一次，但它是从内部循环调用的，因此每一张牌调用一次。在用完所有花色之后，循环抛出 NoSuchElementException。

If you’re really unlucky and the size of the outer collection is a multiple of the size of the inner collection—perhaps because they’re the same collection—the loop will terminate normally, but it won’t do what you want. For example, consider this ill-conceived attempt to print all the possible rolls of a pair of dice:

如果真的很不幸，外部集合的大小是内部集合大小的几倍（可能因为它们是相同的集合），循环将正常终止，但是它不会执行你想要的操作。例如，考虑一个打印一对骰子所有可能的组合值的错误尝试：

```java
// Same bug, different symptom!
enum Face { ONE, TWO, THREE, FOUR, FIVE, SIX }
...
Collection<Face> faces = EnumSet.allOf(Face.class);
for (Iterator<Face> i = faces.iterator(); i.hasNext(); )
for (Iterator<Face> j = faces.iterator(); j.hasNext(); )
System.out.println(i.next() + " " + j.next());
```

The program doesn’t throw an exception, but it prints only the six “doubles” (from “ONE ONE” to “SIX SIX”), instead of the expected thirty-six combinations.

程序不会抛出异常，但它只打印 6 个重复数值（从「ONE ONE」到「SIX SIX」），而不是预期的 36 个组合。

To fix the bugs in these examples, you must add a variable in the scope of the outer loop to hold the outer element:

要修复这些例子中的错误，必须在外部循环的作用域内添加一个变量来保存外部元素：

```java
// Fixed, but ugly - you can do better!
for (Iterator<Suit> i = suits.iterator(); i.hasNext(); ) {
    Suit suit = i.next();
    for (Iterator<Rank> j = ranks.iterator(); j.hasNext(); )
        deck.add(new Card(suit, j.next()));
}
```

If instead you use a nested for-each loop, the problem simply disappears. The resulting code is as succinct as you could wish for:

相反，如果使用嵌套 for-each 循环，问题就会消失。生成的代码更简洁：

```java
// Preferred idiom for nested iteration on collections and arrays
for (Suit suit : suits)
for (Rank rank : ranks)
deck.add(new Card(suit, rank));
```

Unfortunately, there are three common situations where you can’t use foreach:

不幸的是，有三种常见的情况你不应使用 for-each：

- **Destructive filtering** —If you need to traverse a collection removing selected elements, then you need to use an explicit iterator so that you can call its remove method. You can often avoid explicit traversal by using Collection’s removeIf method, added in Java 8.

**破坏性过滤**，如果需要遍历一个集合并删除选定元素，则需要使用显式的迭代器，以便调用其 remove 方法。通过使用 Collection 在 Java 8 中添加的 removeIf 方法，通常可以避免显式遍历。

- **Transforming** —If you need to traverse a list or array and replace some or all of the values of its elements, then you need the list iterator or array index in order to replace the value of an element.

**转换**，如果需要遍历一个 List 或数组并替换其中部分或全部元素的值，那么需要 List 迭代器或数组索引来替换元素的值。

- **Parallel iteration** —If you need to traverse multiple collections in parallel, then you need explicit control over the iterator or index variable so that all iterators or index variables can be advanced in lockstep (as demonstrated unintentionally in the buggy card and dice examples above). If you find yourself in any of these situations, use an ordinary for loop and be wary of the traps mentioned in this item.

**并行迭代**，如果需要并行遍历多个集合，那么需要显式地控制迭代器或索引变量，以便所有迭代器或索引变量都可以同步执行（如上述牌和骰子示例中无意中演示的错误那样）。如果发现自己处于这些情况中的任何一种，请使用普通的 for 循环，并警惕本条目中提到的陷阱。

Not only does the for-each loop let you iterate over collections and arrays, it lets you iterate over any object that implements the Iterable interface, which consists of a single method. Here is how the interface looks:

for-each 循环不仅允许遍历集合和数组，还允许遍历实现 Iterable 接口的任何对象，该接口由一个方法组成。如下所示：

```java
public interface Iterable<E> {
    // Returns an iterator over the elements in this iterable
    Iterator<E> iterator();
}
```

It is a bit tricky to implement Iterable if you have to write your own Iterator implementation from scratch, but if you are writing a type that represents a group of elements, you should strongly consider having it implement Iterable, even if you choose not to have it implement Collection. This will allow your users to iterate over your type using the foreach loop, and they will be forever grateful.

如果必须从头开始编写自己的 Iterator 实现，确实有点棘手，但是如果正在编写的类型表示一组元素，即使选择不让它实现 Collection，那么也应该强烈考虑让它实现 Iterable。这将允许用户使用 foreach 循环遍历类型，他们将永远感激不尽。

In summary, the for-each loop provides compelling advantages over the traditional for loop in clarity, flexibility, and bug prevention, with no performance penalty. Use for-each loops in preference to for loops wherever you can.

总之，for-each 循环在清晰度、灵活性和 bug 预防方面比传统的 for 循环更有优势，并且没有性能损失。尽可能使用 for-each 循环而不是 for 循环。

---

## 【59】了解并使用库

> Know and use the libraries

Suppose you want to generate random integers between zero and some upper bound. Faced with this common task, many programmers would write a little method that looks something like this:

假设你想要生成 0 到某个上界之间的随机整数。面对这个常见任务，许多程序员会编写一个类似这样的小方法：

```java
// Common but deeply flawed!
static Random rnd = new Random();
static int random(int n) {
    return Math.abs(rnd.nextInt()) % n;
}
```

This method may look good, but it has three flaws. The first is that if n is a small power of two, the sequence of random numbers will repeat itself after a fairly short period. The second flaw is that if n is not a power of two, some numbers will, on average, be returned more frequently than others. If n is large, this effect can be quite pronounced. This is powerfully demonstrated by the following program, which generates a million random numbers in a carefully chosen range and then prints out how many of the numbers fell in the lower half of the range:

这个方法看起来不错，但它有三个缺点。首先，如果 n 是小的平方数，随机数序列会在相当短的时间内重复。第二个缺陷是，如果 n 不是 2 的幂，那么平均而言，一些数字将比其他数字更频繁地返回。如果 n 很大，这种效果会很明显。下面的程序有力地证明了这一点，它在一个精心选择的范围内生成 100 万个随机数，然后打印出有多少个数字落在范围的下半部分：

```java
public static void main(String[] args) {
    int n = 2 * (Integer.MAX_VALUE / 3);
    int low = 0;
    for (int i = 0; i < 1000000; i++)
        if (random(n) < n/2)
    low++;
    System.out.println(low);
}
```

If the random method worked properly, the program would print a number close to half a million, but if you run it, you’ll find that it prints a number close to 666,666. Two-thirds of the numbers generated by the random method fall in the lower half of its range!

如果 random 方法工作正常，程序将输出一个接近 50 万的数字，但是如果运行它，你将发现它输出一个接近 666666 的数字。随机方法生成的数字中有三分之二落在其范围的下半部分！

The third flaw in the random method is that it can, on rare occasions, fail catastrophically, returning a number outside the specified range. This is so because the method attempts to map the value returned by rnd.nextInt() to a non-negative int by calling Math.abs. If nextInt() returns Integer.MIN_VALUE, Math.abs will also return Integer.MIN_VALUE, and the remainder operator (%) will return a negative number, assuming n is not a power of two. This will almost certainly cause your program to fail, and the failure may be difficult to reproduce.

random 方法的第三个缺陷是，在极少数情况下会返回超出指定范围的数字，这是灾难性的结果。这是因为该方法试图通过调用 `Math.abs` 将 `rnd.nextInt()` 返回的值映射到非负整数。如果 `nextInt()` 返回整数。`Integer.MIN_VALUE`、`Math.abs` 也将返回整数。假设 n 不是 2 的幂，那么 `Integer.MIN_VALUE` 和求模运算符 `(%)` 将返回一个负数。几乎肯定的是，这会导致你的程序失败，并且这种失败可能难以重现。

To write a version of the random method that corrects these flaws, you’d have to know a fair amount about pseudorandom number generators, number theory, and two’s complement arithmetic. Luckily, you don’t have to do this— it’s been done for you. It’s called Random.nextInt(int). You needn’t concern yourself with the details of how it does its job (although you can study the documentation or the source code if you’re curious). A senior engineer with a background in algorithms spent a good deal of time designing, implementing, and testing this method and then showed it to several experts in the field to make sure it was right. Then the library was beta tested, released, and used extensively by millions of programmers for almost two decades. No flaws have yet been found in the method, but if a flaw were to be discovered, it would be fixed in the next release. **By using a standard library, you take advantage of the knowledge of the experts who wrote it and the experience of those who used it before you.**

要编写一个 random 方法来纠正这些缺陷，你必须对伪随机数生成器、数论和 2 的补码算法有一定的了解。幸运的是，你不必这样做（这是为你而做的成果）。它被称为 `Random.nextInt(int)`。你不必关心它如何工作的（尽管如果你感兴趣，可以研究文档或源代码）。一位具有算法背景的高级工程师花了大量时间设计、实现和测试这种方法，然后将其展示给该领域的几位专家，以确保它是正确的。然后，这个库经过 beta 测试、发布，并被数百万程序员广泛使用了近 20 年。该方法还没有发现任何缺陷，但是如果发现了缺陷，将在下一个版本中进行修复。**通过使用标准库，你可以利用编写它的专家的知识和以前使用它的人的经验。**

As of Java 7, you should no longer use Random. For most uses, **the random number generator of choice is now ThreadLocalRandom.** It produces higher quality random numbers, and it’s very fast. On my machine, it is 3.6 times faster than Random. For fork join pools and parallel streams, use SplittableRandom.

从 Java 7 开始，就不应该再使用 Random。在大多数情况下，**选择的随机数生成器现在是 ThreadLocalRandom。** 它能产生更高质量的随机数，而且速度非常快。在我的机器上，它比 Random 快 3.6 倍。对于 fork 连接池和并行流，使用 SplittableRandom。

A second advantage of using the libraries is that you don’t have to waste your time writing ad hoc solutions to problems that are only marginally related to your work. If you are like most programmers, you’d rather spend your time working on your application than on the underlying plumbing.

使用这些库的第二个好处是，你不必浪费时间为那些与你的工作无关的问题编写专门的解决方案。如果你像大多数程序员一样，那么你宁愿将时间花在应用程序上，而不是底层管道上。

A third advantage of using standard libraries is that their performance tends to improve over time, with no effort on your part. Because many people use them and because they’re used in industry-standard benchmarks, the organizations that supply these libraries have a strong incentive to make them run faster. Many of the Java platform libraries have been rewritten over the years, sometimes repeatedly, resulting in dramatic performance improvements. A fourth advantage of using libraries is that they tend to gain functionality over time. If a library is missing something, the developer community will make it known, and the missing functionality may get added in a subsequent release.

使用标准库的第三个优点是，随着时间的推移，它们的性能会不断提高，而你无需付出任何努力。由于许多人使用它们，而且它们是在行业标准基准中使用的，所以提供这些库的组织有很强的动机使它们运行得更快。多年来，许多 Java 平台库都被重新编写过，有时甚至是反复编写，从而带来了显著的性能改进。使用库的第四个好处是，随着时间的推移，它们往往会获得新功能。如果一个库丢失了一些东西，开发人员社区会将其公布于众，并且丢失的功能可能会在后续版本中添加。

A final advantage of using the standard libraries is that you place your code in the mainstream. Such code is more easily readable, maintainable, and reusable by the multitude of developers.

使用标准库的最后一个好处是，可以将代码放在主干中。这样的代码更容易被开发人员阅读、维护和重用。

Given all these advantages, it seems only logical to use library facilities in preference to ad hoc implementations, yet many programmers don’t. Why not? Perhaps they don’t know the library facilities exist. **Numerous features are added to the libraries in every major release, and it pays to keep abreast of these additions.** Each time there is a major release of the Java platform, a web page is published describing its new features. These pages are well worth reading [Java8-feat, Java9-feat]. To reinforce this point, suppose you wanted to write a program to print the contents of a URL specified on the command line (which is roughly what the Linux curl command does). Prior to Java 9, this code was a bit tedious, but in Java 9 the transferTo method was added to InputStream. Here is a complete program to perform this task using this new method:

考虑到所有这些优点，使用库工具而不选择专门的实现似乎是合乎逻辑的，但许多程序员并不这样做。为什么不呢？也许他们不知道库的存在。**在每个主要版本中，都会向库中添加许多特性，了解这些新增特性是值得的。** 每次发布 Java 平台的主要版本时，都会发布一个描述其新特性的 web 页面。这些页面非常值得一读 [Java8-feat, Java9-feat]。为了强调这一点，假设你想编写一个程序来打印命令行中指定的 URL 的内容（这大致是 Linux curl 命令所做的）。在 Java 9 之前，这段代码有点乏味，但是在 Java 9 中，transferTo 方法被添加到 InputStream 中。这是一个使用这个新方法执行这项任务的完整程序：

```java
// Printing the contents of a URL with transferTo, added in Java 9
public static void main(String[] args) throws IOException {
    try (InputStream in = new URL(args[0]).openStream()) {
        in.transferTo(System.out);
    }
}
```

The libraries are too big to study all the documentation [Java9-api], but **every programmer should be familiar with the basics of java.lang, java.util, and java.io, and their subpackages.** Knowledge of other libraries can be acquired on an as-needed basis. It is beyond the scope of this item to summarize the facilities in the libraries, which have grown immense over the years.

库太大，无法学习所有文档 [Java9-api]，但是 **每个程序员都应该熟悉 `java.lang`、`java.util` 和 `java.io` 的基础知识及其子包。** 其他库的知识可以根据需要获得。概述库中的工具超出了本项目的范围，这些工具多年来已经发展得非常庞大。

Several libraries bear special mention. The collections framework and the streams library (Items 45–48) should be part of every programmer’s basic toolkit, as should parts of the concurrency utilities in java.util.concurrent. This package contains both high-level utilities to simplify the task of multithreaded programming and low-level primitives to allow experts to write their own higher-level concurrent abstractions. The highlevel parts of java.util.concurrent are discussed in Items 80 and 81.

有几个图书馆值得一提。collections 框架和 streams 库（可参看 Item 45-48）应该是每个程序员的基本工具包的一部分，`java.util.concurrent` 中的并发实用程序也应该是其中的一部分。这个包既包含高级的并发工具来简化多线程的编程任务，还包含低级别的并发基本类型，允许专家们自己编写更高级的并发抽象。`java.util.concurrent` 的高级部分，在 Item-80 和 Item-81 中讨论。

Occasionally, a library facility can fail to meet your needs. The more specialized your needs, the more likely this is to happen. While your first impulse should be to use the libraries, if you’ve looked at what they have to offer in some area and it doesn’t meet your needs, then use an alternate implementation. There will always be holes in the functionality provided by any finite set of libraries. If you can’t find what you need in Java platform libraries, your next choice should be to look in high-quality third-party libraries, such as Google’s excellent, open source Guava library [Guava]. If you can’t find the functionality that you need in any appropriate library, you may have no choice but to implement it yourself.

有时，类库工具可能无法满足你的需求。你的需求越专门化，发生这种情况的可能性就越大。虽然你的第一个思路应该是使用这些库，但是如果你已经了解了它们在某些领域提供的功能，而这些功能不能满足你的需求，那么可以使用另一种实现。任何有限的库集所提供的功能总是存在漏洞。如果你在 Java 平台库中找不到你需要的东西，你的下一个选择应该是寻找高质量的第三方库，比如谷歌的优秀的开源 Guava 库 [Guava]。如果你无法在任何适当的库中找到所需的功能，你可能别无选择，只能自己实现它。

To summarize, don’t reinvent the wheel. If you need to do something that seems like it should be reasonably common, there may already be a facility in the libraries that does what you want. If there is, use it; if you don’t know, check. Generally speaking, library code is likely to be better than code that you’d write yourself and is likely to improve over time. This is no reflection on your abilities as a programmer. Economies of scale dictate that library code receives far more attention than most developers could afford to devote to the same functionality.

总而言之，不要白费力气重新发明轮子。如果你需要做一些看起来相当常见的事情，那么库中可能已经有一个工具可以做你想做的事情。如果有，使用它；如果你不知道，检查一下。一般来说，库代码可能比你自己编写的代码更好，并且随着时间的推移可能会得到改进。这并不反映你作为一个程序员的能力。规模经济决定了库代码得到的关注要远远超过大多数开发人员所能承担的相同功能。

---

## 【60】若需要精确答案就应避免使用 float 和 double 类型

> Avoid float and double if exact answers are required

The float and double types are designed primarily for scientific and engineering calculations. They perform binary floating-point arithmetic, which was carefully designed to furnish accurate approximations quickly over a broad range of magnitudes. They do not, however, provide exact results and should not be used where exact results are required. **The float and double types are particularly ill-suited for monetary calculations** because it is impossible to represent 0.1 (or any other negative power of ten) as a float or double exactly.

float 和 double 类型主要用于科学计算和工程计算。它们执行二进制浮点运算，该算法经过精心设计，能够在很大范围内快速提供精确的近似值。但是，它们不能提供准确的结果，也不应该在需要精确结果的地方使用。**float 和 double 类型特别不适合进行货币计算**，因为不可能将 0.1（或 10 的任意负次幂）精确地表示为 float 或 double。

For example, suppose you have \$1.03 in your pocket, and you spend 42¢. How much money do you have left? Here’s a naive program fragment that attempts to answer this question:

例如，假设你口袋里有 1.03 美元，你消费了 42 美分。你还剩下多少钱？下面是一个简单的程序片段，试图回答这个问题：

```java
System.out.println(1.03 - 0.42);
```

Unfortunately, it prints out 0.6100000000000001. This is not an isolated case. Suppose you have a dollar in your pocket, and you buy nine washers priced at ten cents each. How much change do you get?

不幸的是，它输出了 0.6100000000000001。这不是一个特例。假设你口袋里有一美元，你买了 9 台洗衣机，每台 10 美分。你能得到多少零钱？

```java
System.out.println(1.00 - 9 * 0.10);
```

According to this program fragment, you get \$0.09999999999999998.

根据这个程序片段，可以得到 0.0999999999999999998 美元。

You might think that the problem could be solved merely by rounding results prior to printing, but unfortunately this does not always work. For example, suppose you have a dollar in your pocket, and you see a shelf with a row of delicious candies priced at 10¢, 20¢, 30¢, and so forth, up to a dollar. You buy one of each candy, starting with the one that costs 10¢, until you can’t afford to buy the next candy on the shelf. How many candies do you buy, and how much change do you get? Here’s a naive program designed to solve this problem:

你可能认为，只需在打印之前将结果四舍五入就可以解决这个问题，但不幸的是，这种方法并不总是有效。例如，假设你口袋里有一美元，你看到一个架子上有一排好吃的糖果，它们的价格仅仅是 10 美分，20 美分，30 美分，以此类推，直到 1 美元。你每买一颗糖，从 10 美分的那颗开始，直到你买不起货架上的下一颗糖。你买了多少糖果，换了多少零钱？这里有一个简单的程序来解决这个问题：

```java
// Broken - uses floating point for monetary calculation!
public static void main(String[] args) {
    double funds = 1.00;
    int itemsBought = 0;
    for (double price = 0.10; funds >= price; price += 0.10) {
        funds -= price;
        itemsBought++;
    }
    System.out.println(itemsBought +"items bought.");
    System.out.println("Change: $" + funds);
}
```

If you run the program, you’ll find that you can afford three pieces of candy, and you have \$0.3999999999999999 left. This is the wrong answer! The right way to solve this problem is to **use BigDecimal, int, or long for monetary calculations.**

如果你运行这个程序，你会发现你可以买得起三块糖，你还有 0.399999999999999999 美元。这是错误的答案！解决这个问题的正确方法是 **使用 BigDecimal、int 或 long 进行货币计算。**

Here’s a straightforward transformation of the previous program to use the BigDecimal type in place of double. Note that BigDecimal’s String constructor is used rather than its double constructor. This is required in order to avoid introducing inaccurate values into the computation [Bloch05, Puzzle 2]:

这里是前一个程序的一个简单改版，使用 BigDecimal 类型代替 double。注意，使用 BigDecimal 的 String 构造函数而不是它的 double 构造函数。这是为了避免在计算中引入不准确的值 [Bloch05, Puzzle 2]：

```java
public static void main(String[] args) {
    final BigDecimal TEN_CENTS = new BigDecimal(".10");
    int itemsBought = 0;
    BigDecimal funds = new BigDecimal("1.00");
    for (BigDecimal price = TEN_CENTS;funds.compareTo(price) >= 0;price = price.add(TEN_CENTS)) {
        funds = funds.subtract(price);
    itemsBought++;
    }
    System.out.println(itemsBought +"items bought.");
    System.out.println("Money left over: $" + funds);
}
```

If you run the revised program, you’ll find that you can afford four pieces of candy, with \$0.00 left over. This is the correct answer.

如果你运行修改后的程序，你会发现你可以买四颗糖，最终剩下 0 美元。这是正确答案。

There are, however, two disadvantages to using BigDecimal: it’s a lot less convenient than using a primitive arithmetic type, and it’s a lot slower. The latter disadvantage is irrelevant if you’re solving a single short problem, but the former may annoy you.

然而，使用 BigDecimal 有两个缺点：它与原始算术类型相比很不方便，而且速度要慢得多。如果你只解决一个简单的问题，后一种缺点是无关紧要的，但前者可能会让你烦恼。

An alternative to using BigDecimal is to use int or long, depending on the amounts involved, and to keep track of the decimal point yourself. In this example, the obvious approach is to do all computation in cents instead of dollars. Here’s a straightforward transformation that takes this approach:

除了使用 BigDecimal，另一种方法是使用 int 或 long，这取决于涉及的数值大小，还要自己处理十进制小数点。在这个例子中，最明显的方法是用美分而不是美元来计算。下面是一个采用这种方法的简单改版：

```java
public static void main(String[] args) {
    int itemsBought = 0;
    int funds = 100;
    for (int price = 10; funds >= price; price += 10) {
        funds -= price;
        itemsBought++;
    }
    System.out.println(itemsBought +"items bought.");
    System.out.println("Cash left over: " + funds + " cents");
}
```

In summary, don’t use float or double for any calculations that require an exact answer. Use BigDecimal if you want the system to keep track of the decimal point and you don’t mind the inconvenience and cost of not using a primitive type. Using BigDecimal has the added advantage that it gives you full control over rounding, letting you select from eight rounding modes whenever an operation that entails rounding is performed. This comes in handy if you’re performing business calculations with legally mandated rounding behavior. If performance is of the essence, you don’t mind keeping track of the decimal point yourself, and the quantities aren’t too big, use int or long. If the quantities don’t exceed nine decimal digits, you can use int; if they don’t exceed eighteen digits, you can use long. If the quantities might exceed eighteen digits, use BigDecimal.

总之，对于任何需要精确答案的计算，不要使用 float 或 double 类型。如果希望系统来处理十进制小数点，并且不介意不使用基本类型带来的不便和成本，请使用 BigDecimal。使用 BigDecimal 的另一个好处是，它可以完全控制舍入，当执行需要舍入的操作时，可以从八种舍入模式中进行选择。如果你使用合法的舍入行为执行业务计算，这将非常方便。如果性能是最重要的，那么你不介意自己处理十进制小数点，而且数值不是太大，可以使用 int 或 long。如果数值不超过 9 位小数，可以使用 int；如果不超过 18 位，可以使用 long。如果数量可能超过 18 位，则使用 BigDecimal。

---

## 【61】基本数据类型优于包装类

> Prefer primitive types to boxed primitives

Java has a two-part type system, consisting of primitives, such as int, double, and boolean, and reference types, such as String and List. Every primitive type has a corresponding reference type, called a boxed primitive. The boxed primitives corresponding to int, double, and boolean are Integer, Double, and Boolean.

Java 有一个由两部分组成的类型系统，包括基本类型（如 int、double 和 boolean）和引用类型（如 String 和 List）。每个基本类型都有一个对应的引用类型，称为包装类型。与 int、double 和 boolean 对应的包装类是 Integer、Double 和 Boolean。

As mentioned in Item 6, autoboxing and auto-unboxing blur but do not erase the distinction between the primitive and boxed primitive types. There are real differences between the two, and it’s important that you remain aware of which you are using and that you choose carefully between them.

正如 Item-6 中提到的，自动装箱和自动拆箱模糊了基本类型和包装类型之间的区别，但不会消除它们。这两者之间有真正的区别，重要的是你要始终意识到正在使用的是哪一种，并在它们之间仔细选择。

There are three major differences between primitives and boxed primitives. First, primitives have only their values, whereas boxed primitives have identities distinct from their values. In other words, two boxed primitive instances can have the same value and different identities. Second, primitive types have only fully functional values, whereas each boxed primitive type has one nonfunctional value, which is null, in addition to all the functional values of the corresponding primitive type. Last, primitives are more time- and spaceefficient than boxed primitives. All three of these differences can get you into real trouble if you aren’t careful.

基本类型和包装类型之间有三个主要区别。首先，基本类型只有它们的值，而包装类型具有与其值不同的标识。换句话说，两个包装类型实例可以具有相同的值和不同的标识。第二，基本类型只有全功能值，而每个包装类型除了对应的基本类型的所有功能值外，还有一个非功能值，即 null。最后，基本类型比包装类型更节省时间和空间。如果你不小心的话，这三种差异都会给你带来真正的麻烦。

Consider the following comparator, which is designed to represent ascending numerical order on Integer values. (Recall that a comparator’s compare method returns a number that is negative, zero, or positive, depending on whether its first argument is less than, equal to, or greater than its second.) You wouldn’t need to write this comparator in practice because it implements the natural ordering on Integer, but it makes for an interesting example:

考虑下面的比较器，它的设计目的是表示 Integer 值上的升序数字排序。（回想一下，比较器的 compare 方法返回一个负数、零或正数，这取决于它的第一个参数是小于、等于还是大于第二个参数。）你不需要在实际使用中编写这个比较器，因为它实现了 Integer 的自然排序，但它提供了一个有趣的例子：

```java
// Broken comparator - can you spot the flaw?
Comparator<Integer> naturalOrder =(i, j) -> (i < j) ? -1 : (i == j ? 0 : 1);
```

This comparator looks like it ought to work, and it will pass many tests. For example, it can be used with Collections.sort to correctly sort a millionelement list, whether or not the list contains duplicate elements. But the comparator is deeply flawed. To convince yourself of this, merely print the value of naturalOrder.compare(new Integer(42), new Integer(42)). Both Integer instances represent the same value (42), so the value of this expression should be 0, but it’s 1, which indicates that the first Integer value is greater than the second!

这个比较器看起来应该可以工作，它将通过许多测试。例如，它可以与 `Collections.sort` 一起使用，以正确地排序一个百万元素的 List，无论该 List 是否包含重复的元素。但这个比较存在严重缺陷。要使自己相信这一点，只需打印 `naturalOrder.compare(new Integer(42), new Integer(42))` 的值。两个 Integer 实例都表示相同的值 `(42)`，所以这个表达式的值应该是 0，但它是 1，这表明第一个 Integer 值大于第二个！

So what’s the problem? The first test in naturalOrder works fine. Evaluating the expression i < j causes the Integer instances referred to by i and j to be auto-unboxed; that is, it extracts their primitive values. The evaluation proceeds to check if the first of the resulting int values is less than the second. But suppose it is not. Then the next test evaluates the expression i==j, which performs an identity comparison on the two object references. If i and j refer to distinct Integer instances that represent the same int value, this comparison will return false, and the comparator will incorrectly return 1, indicating that the first Integer value is greater than the second. **Applying the == operator to boxed primitives is almost always wrong.**

那么问题出在哪里呢？naturalOrder 中的第一个测试工作得很好。计算表达式 `i < j` 会使 i 和 j 引用的 Integer 实例自动拆箱；也就是说，它提取它们的基本类型值。计算的目的是检查得到的第一个 int 值是否小于第二个 int 值。但假设它不是。然后，下一个测试计算表达式 `i==j`，该表达式对两个对象引用执行标识比较。如果 i 和 j 引用表示相同 int 值的不同 Integer 实例，这个比较将返回 false，比较器将错误地返回 1，表明第一个整型值大于第二个整型值。**将 `==` 操作符应用于包装类型几乎都是错误的。**

In practice, if you need a comparator to describe a type’s natural order, you should simply call Comparator.naturalOrder(), and if you write a comparator yourself, you should use the comparator construction methods, or the static compare methods on primitive types (Item 14). That said, you could fix the problem in the broken comparator by adding two local variables to store the primitive int values corresponding to the boxed Integer parameters, and performing all of the comparisons on these variables. This avoids the erroneous identity comparison:

在实际使用中，如果你需要一个比较器来描述类型的自然顺序，你应该简单地调用 `Comparator.naturalOrder()`，如果你自己编写一个比较器，你应该使用比较器构造方法，或者对基本类型使用静态比较方法（Item-14）。也就是说，你可以通过添加两个局部变量来存储基本类型 int 值，并对这些变量执行所有的比较，从而修复损坏的比较器中的问题。这避免了错误的标识比较：

```java
Comparator<Integer> naturalOrder = (iBoxed, jBoxed) -> {
    int i = iBoxed, j = jBoxed; // Auto-unboxing
    return i < j ? -1 : (i == j ? 0 : 1);
};
```

Next, consider this delightful little program:

接下来，考虑一下这个有趣的小程序：

```java
public class Unbelievable {
static Integer i;
public static void main(String[] args) {
    if (i == 42)
        System.out.println("Unbelievable");
    }
}
```

No, it doesn’t print Unbelievable—but what it does is almost as strange. It throws a NullPointerException when evaluating the expression i==42. The problem is that i is an Integer, not an int, and like all nonconstant object reference fields, its initial value is null. When the program evaluates the expression i==42, it is comparing an Integer to an int. In nearly every case **when you mix primitives and boxed primitives in an operation, the boxed primitive is auto-unboxed.** If a null object reference is auto-unboxed, you get a NullPointerException. As this program demonstrates, it can happen almost anywhere. Fixing the problem is as simple as declaring i to be an int instead of an Integer.

不，它不会打印出令人难以置信的东西，但它的行为很奇怪。它在计算表达式 `i==42` 时抛出 NullPointerException。问题是，i 是 Integer，而不是 int 数，而且像所有非常量对象引用字段一样，它的初值为 null。当程序计算表达式 `i==42` 时，它是在比较 Integer 与 int。**在操作中混合使用基本类型和包装类型时，包装类型就会自动拆箱**，这种情况无一例外。如果一个空对象引用自动拆箱，那么你将得到一个 NullPointerException。正如这个程序所演示的，它几乎可以在任何地方发生。修复这个问题非常简单，只需将 i 声明为 int 而不是 Integer。

Finally, consider the program from page 24 in Item 6:

最后，考虑 Item-6 中第 24 页的程序：

```java
// Hideously slow program! Can you spot the object creation?
public static void main(String[] args) {
    Long sum = 0L;
    for (long i = 0; i < Integer.MAX_VALUE; i++) {
        sum += i;
    }
    System.out.println(sum);
}
```

This program is much slower than it should be because it accidentally declares a local variable (sum) to be of the boxed primitive type Long instead of the primitive type long. The program compiles without error or warning, and the variable is repeatedly boxed and unboxed, causing the observed performance degradation.

这个程序比它预期的速度慢得多，因为它意外地声明了一个局部变量 `(sum)`，它是包装类型 Long，而不是基本类型 long。程序在没有错误或警告的情况下编译，变量被反复装箱和拆箱，导致产生明显的性能下降。

In all three of the programs discussed in this item, the problem was the same: the programmer ignored the distinction between primitives and boxed primitives and suffered the consequences. In the first two programs, the consequences were outright failure; in the third, severe performance problems.

在本条目中讨论的所有三个程序中，问题都是一样的：程序员忽略了基本类型和包装类型之间的区别，并承担了恶果。在前两个项目中，结果是彻底的失败；第三个例子还产生了严重的性能问题。

So when should you use boxed primitives? They have several legitimate uses. The first is as elements, keys, and values in collections. You can’t put primitives in collections, so you’re forced to use boxed primitives. This is a special case of a more general one. You must use boxed primitives as type parameters in parameterized types and methods (Chapter 5), because the language does not permit you to use primitives. For example, you cannot declare a variable to be of type `ThreadLocal<int>`, so you must use `ThreadLocal<Integer>` instead. Finally, you must use boxed primitives when making reflective method invocations (Item 65).

那么，什么时候应该使用包装类型呢？它们有几个合法的用途。第一个是作为集合中的元素、键和值。不能将基本类型放在集合中，因此必须使用包装类型。这是一般情况下的特例。在参数化类型和方法（Chapter 5）中，必须使用包装类型作为类型参数，因为 Java 不允许使用基本类型。例如，不能将变量声明为 `ThreadLocal<int>` 类型，因此必须使用 `ThreadLocal<Integer>`。最后，在进行反射方法调用时，必须使用包装类型（Item-65）。

In summary, use primitives in preference to boxed primitives whenever you have the choice. Primitive types are simpler and faster. If you must use boxed primitives, be careful! **Autoboxing reduces the verbosity, but not the danger, of using boxed primitives.** When your program compares two boxed primitives with the == operator, it does an identity comparison, which is almost certainly not what you want. When your program does mixed-type computations involving boxed and unboxed primitives, it does unboxing, and **when your program does unboxing, it can throw a NullPointerException.** Finally, when your program boxes primitive values, it can result in costly and unnecessary object creations.

总之，只要有选择，就应该优先使用基本类型，而不是包装类型。基本类型更简单、更快。如果必须使用包装类型，请小心！**自动装箱减少了使用包装类型的冗长，但没有减少危险。** 当你的程序使用 `==` 操作符比较两个包装类型时，它会执行标识比较，这几乎肯定不是你想要的。当你的程序执行包含包装类型和基本类型的混合类型计算时，它将进行拆箱，**当你的程序执行拆箱时，将抛出 NullPointerException。** 最后，当你的程序将基本类型装箱时，可能会导致代价高昂且不必要的对象创建。

---

## 【62】其他类型更合适时应避免使用字符串

> Avoid strings where other types are more appropriate

Strings are designed to represent text, and they do a fine job of it. Because strings are so common and so well supported by the language, there is a natural tendency to use strings for purposes other than those for which they were designed. This item discusses a few things that you shouldn’t do with strings.

字符串被设计用来表示文本，它们在这方面做得很好。因为字符串是如此常见，并且受到 Java 的良好支持，所以很自然地会将字符串用于其他目的，而不是它们适用的场景。本条目讨论了一些不应该使用字符串的场景。

**Strings are poor substitutes for other value types.** When a piece of data comes into a program from a file, from the network, or from keyboard input, it is often in string form. There is a natural tendency to leave it that way, but this tendency is justified only if the data really is textual in nature. If it’s numeric, it should be translated into the appropriate numeric type, such as int, float, or BigInteger. If it’s the answer to a yes-or-no question, it should be translated into an appropriate enum type or a boolean. More generally, if there’s an appropriate value type, whether primitive or object reference, you should use it; if there isn’t, you should write one. While this advice may seem obvious, it is often violated.

字符串是其他值类型的糟糕替代品。当一段数据从文件、网络或键盘输入到程序时，它通常是字符串形式的。有一种很自然的倾向是保持这种格式不变，但是这种倾向只有在数据本质上是文本的情况下才合理。如果是数值类型，则应将其转换为适当的数值类型，如 int、float 或 BigInteger。如果是问题的答案，如「是」或「否」这类形式，则应将其转换为适当的枚举类型或布尔值。更一般地说，如果有合适的值类型，无论是基本类型还是对象引用，都应该使用它；如果没有，你应该写一个。虽然这条建议似乎很多余，但经常被违反。

**Strings are poor substitutes for enum types.** As discussed in Item 34, enums make far better enumerated type constants than strings.

**字符串是枚举类型的糟糕替代品。** 正如 Item-34 中所讨论的，枚举类型常量比字符串更适合于枚举类型常量。

**Strings are poor substitutes for aggregate types.** If an entity has multiple components, it is usually a bad idea to represent it as a single string. For example, here’s a line of code that comes from a real system—identifier names have been changed to protect the guilty:

**字符串是聚合类型的糟糕替代品。** 如果一个实体有多个组件，将其表示为单个字符串通常是一个坏主意。例如，下面这行代码来自一个真实的系统标识符，它的名称已经被更改，以免引发罪责：

```java
// Inappropriate use of string as aggregate type
String compoundKey = className + "#" + i.next();
```

This approach has many disadvantages. If the character used to separate fields occurs in one of the fields, chaos may result. To access individual fields, you have to parse the string, which is slow, tedious, and error-prone. You can’t provide equals, toString, or compareTo methods but are forced to accept the behavior that String provides. A better approach is simply to write a class to represent the aggregate, often a private static member class (Item 24).

这种方法有很多缺点。如果用于分隔字段的字符出现在其中一个字段中，可能会导致混乱。要访问各个字段，你必须解析字符串，这是缓慢的、冗长的、容易出错的过程。你不能提供 equals、toString 或 compareTo 方法，但必须接受 String 提供的行为。更好的方法是编写一个类来表示聚合，通常是一个私有静态成员类（Item-24）。

**Strings are poor substitutes for capabilities.** Occasionally, strings are used to grant access to some functionality. For example, consider the design of a thread-local variable facility. Such a facility provides variables for which each thread has its own value. The Java libraries have had a thread-local variable facility since release 1.2, but prior to that, programmers had to roll their own. When confronted with the task of designing such a facility many years ago, several people independently came up with the same design, in which clientprovided string keys are used to identify each thread-local variable:

**字符串不能很好地替代 capabilities。** 有时，字符串用于授予对某些功能的访问权。例如，考虑线程本地变量机制的设计。这样的机制提供了每个线程都有自己的变量值。自 1.2 版以来，Java 库就有了一个线程本地变量机制，但在此之前，程序员必须自己设计。许多年前，当面临设计这样一个机制的任务时，有人提出了相同的设计，其中客户端提供的字符串键，用于标识每个线程本地变量：

```java
// Broken - inappropriate use of string as capability!
public class ThreadLocal {
    private ThreadLocal() { } // Noninstantiable

    // Sets the current thread's value for the named variable.
    public static void set(String key, Object value);

    // Returns the current thread's value for the named variable.
    public static Object get(String key);
}
```

The problem with this approach is that the string keys represent a shared global namespace for thread-local variables. In order for the approach to work, the client-provided string keys have to be unique: if two clients independently decide to use the same name for their thread-local variable, they unintentionally share a single variable, which will generally cause both clients to fail. Also, the security is poor. A malicious client could intentionally use the same string key as another client to gain illicit access to the other client’s data.

这种方法的问题在于，字符串键表示线程本地变量的共享全局名称空间。为了使这种方法有效，客户端提供的字符串键必须是惟一的：如果两个客户端各自决定为它们的线程本地变量使用相同的名称，它们无意中就会共享一个变量，这通常会导致两个客户端都失败。而且，安全性很差。恶意客户端可以故意使用与另一个客户端相同的字符串密钥来非法访问另一个客户端的数据。

This API can be fixed by replacing the string with an unforgeable key (sometimes called a capability):

这个 API 可以通过用一个不可伪造的键（有时称为 capability）替换字符串来修复：

```java
public class ThreadLocal {
    private ThreadLocal() { } // Noninstantiable

    public static class Key { // (Capability)
        Key() { }
}

// Generates a unique, unforgeable key
public static Key getKey() {
    return new Key();
}

public static void set(Key key, Object value);

public static Object get(Key key);
}
```

While this solves both of the problems with the string-based API, you can do much better. You don’t really need the static methods anymore. They can instead become instance methods on the key, at which point the key is no longer a key for a thread-local variable: it is a thread-local variable. At this point, the toplevel class isn’t doing anything for you anymore, so you might as well get rid of it and rename the nested class to ThreadLocal:

虽然这解决了 API 中基于字符串的两个问题，但是你可以做得更好。你不再真正需要静态方法。它们可以变成键上的实例方法，此时键不再是线程局部变量：而是线程局部变量。此时，顶层类不再为你做任何事情，所以你可以删除它，并将嵌套类重命名为 ThreadLocal：

```java
public final class ThreadLocal {
    public ThreadLocal();
    public void set(Object value);
    public Object get();
}
```

This API isn’t typesafe, because you have to cast the value from Object to its actual type when you retrieve it from a thread-local variable. It is impossible to make the original String-based API typesafe and difficult to make the Keybased API typesafe, but it is a simple matter to make this API typesafe by making ThreadLocal a parameterized class (Item 29):

这个 API 不是类型安全的，因为在从线程本地变量检索值时，必须将值从 Object 转换为它的实际类型。原始的基于 String 类型 API 的类型安全是不可能实现的，基于键的 API 的类型安全也是很难实现的，但是通过将 ThreadLocal 作为一个参数化的类来实现这个 API 的类型安全很简单（Item-29）：

```java
public final class ThreadLocal<T> {
    public ThreadLocal();
    public void set(T value);
    public T get();
}
```

This is, roughly speaking, the API that java.lang.ThreadLocal provides. In addition to solving the problems with the string-based API, it is faster and more elegant than either of the key-based APIs.

粗略地说，这就是 `java.lang.ThreadLocal` 提供的 API，除了解决基于字符串的问题之外，它比任何基于键的 API 都更快、更优雅。

To summarize, avoid the natural tendency to represent objects as strings when better data types exist or can be written. Used inappropriately, strings are more cumbersome, less flexible, slower, and more error-prone than other types. Types for which strings are commonly misused include primitive types, enums, and aggregate types.

总之，当存在或可以编写更好的数据类型时，应避免将字符串用来表示对象。如果使用不当，字符串比其他类型更麻烦、灵活性更差、速度更慢、更容易出错。字符串经常被误用的类型包括基本类型、枚举和聚合类型。

---

## 【63】当心字符串连接引起的性能问题

> Beware the performance of string concatenation

The string concatenation operator (+) is a convenient way to combine a few strings into one. It is fine for generating a single line of output or constructing the string representation of a small, fixed-size object, but it does not scale. Using **the string concatenation operator repeatedly to concatenate n strings requires time quadratic in n.** This is an unfortunate consequence of the fact that strings are immutable (Item 17). When two strings are concatenated, the contents of both are copied.

字符串连接操作符 `(+)` 是将几个字符串组合成一个字符串的简便方法。对于生成单行输出或构造一个小的、固定大小的对象的字符串表示形式，它是可以的，但是它不能伸缩。使用 **字符串串联运算符重复串联 n 个字符串需要 n 的平方级时间。** 这是字符串不可变这一事实导致的结果（Item-17）。当连接两个字符串时，将复制这两个字符串的内容。

For example, consider this method, which constructs the string representation of a billing statement by repeatedly concatenating a line for each item:

例如，考虑这个方法，它通过将每个账单项目重复连接到一行来构造账单语句的字符串表示：

```java
// Inappropriate use of string concatenation - Performs poorly!
public String statement() {
    String result = "";
    for (int i = 0; i < numItems(); i++)
        result += lineForItem(i); // String concatenation
    return result;
}
```

The method performs abysmally if the number of items is large. **To achieve acceptable performance, use a StringBuilder in place of a String** to store the statement under construction:

如果项的数量很大，则该方法的性能非常糟糕。**要获得能接受的性能，请使用 StringBuilder 代替 String** 来存储正在构建的语句：

```java
public String statement() {
    StringBuilder b = new StringBuilder(numItems() * LINE_WIDTH);
    for (int i = 0; i < numItems(); i++)
        b.append(lineForItem(i));
    return b.toString();
}
```

A lot of work has gone into making string concatenation faster since Java 6, but the difference in the performance of the two methods is still dramatic: If numItems returns 100 and lineForItem returns an 80-character string, the second method runs 6.5 times faster than the first on my machine. Because the first method is quadratic in the number of items and the second is linear, the performance difference gets much larger as the number of items grows. Note that the second method preallocates a StringBuilder large enough to hold the entire result, eliminating the need for automatic growth. Even if it is detuned to use a default-sized StringBuilder, it is still 5.5 times faster than the first method.

自 Java 6 以来，为了使字符串连接更快，已经做了大量工作，但是这两个方法在性能上的差异仍然很大：如果 numItems 返回 100，lineForItem 返回 80 个字符串，那么第二个方法在我的机器上运行的速度是第一个方法的 6.5 倍。由于第一种方法在项目数量上是平方级的，而第二种方法是线性的，所以随着项目数量的增加，性能差异会变得越来越大。注意，第二个方法预先分配了一个足够大的 StringBuilder 来保存整个结果，从而消除了自动增长的需要。即使使用默认大小的 StringBuilder，它仍然比第一个方法快 5.5 倍。

The moral is simple: **Don’t use the string concatenation operator to combine more than a few strings** unless performance is irrelevant. Use StringBuilder’s append method instead. Alternatively, use a character array, or process the strings one at a time instead of combining them.

道理很简单：**不要使用字符串连接操作符合并多个字符串**，除非性能无关紧要。否则使用 StringBuilder 的 append 方法。或者，使用字符数组，再或者一次只处理一个字符串，而不是组合它们。

---

## 【64】通过接口引用对象

> Refer to objects by their interfaces

Item 51 says that you should use interfaces rather than classes as parameter types. More generally, you should favor the use of interfaces over classes to refer to objects. **If appropriate interface types exist, then parameters, return values, variables, and fields should all be declared using interface types.** The only time you really need to refer to an object’s class is when you’re creating it with a constructor. To make this concrete, consider the case of LinkedHashSet, which is an implementation of the Set interface. Get in the habit of typing this:

Item-51 指出，应该使用接口而不是类作为参数类型。更一般地说，你应该优先使用接口而不是类来引用对象。**如果存在合适的接口类型，那么应该使用接口类型声明参数、返回值、变量和字段。** 惟一真正需要引用对象的类的时候是使用构造函数创建它的时候。为了具体说明这一点，考虑 LinkedHashSet 的情况，它是 Set 接口的一个实现。声明时应养成这样的习惯：

```java
// Good - uses interface as type
Set<Son> sonSet = new LinkedHashSet<>();
```

not this:

而不是这样：

```java
// Bad - uses class as type!
LinkedHashSet<Son> sonSet = new LinkedHashSet<>();
```

**If you get into the habit of using interfaces as types, your program will be much more flexible.** If you decide that you want to switch implementations, all you have to do is change the class name in the constructor (or use a different static factory). For example, the first declaration could be changed to read:

**如果你养成了使用接口作为类型的习惯，那么你的程序将更加灵活。** 如果你决定要切换实现，只需在构造函数中更改类名（或使用不同的静态工厂）。例如，第一个声明可以改为：

```java
Set<Son> sonSet = new HashSet<>();
```

and all of the surrounding code would continue to work. The surrounding code was unaware of the old implementation type, so it would be oblivious to the change.

所有的代码都会继续工作。周围的代码不知道旧的实现类型，所以它不会在意更改。

There is one caveat: if the original implementation offered some special functionality not required by the general contract of the interface and the code depended on that functionality, then it is critical that the new implementation provide the same functionality. For example, if the code surrounding the first declaration depended on LinkedHashSet’s ordering policy, then it would be incorrect to substitute HashSet for LinkedHashSet in the declaration, because HashSet makes no guarantee concerning iteration order.

有一点值得注意：如果原实现提供了接口的通用约定不需要的一些特殊功能，并且代码依赖于该功能，那么新实现提供相同的功能就非常重要。例如，如果围绕第一个声明的代码依赖于 LinkedHashSet 的排序策略，那么在声明中将 HashSet 替换为 LinkedHashSet 将是不正确的，因为 HashSet 不保证迭代顺序。

So why would you want to change an implementation type? Because the second implementation offers better performance than the original, or because it offers desirable functionality that the original implementation lacks. For example, suppose a field contains a HashMap instance. Changing it to an EnumMap will provide better performance and iteration order consistent with the natural order of the keys, but you can only use an EnumMap if the key type is an enum type. Changing the HashMap to a LinkedHashMap will provide predictable iteration order with performance comparable to that of HashMap, without making any special demands on the key type.

那么，为什么要更改实现类型呢？因为第二个实现比原来的实现提供了更好的性能，或者因为它提供了原来的实现所缺乏的理想功能。例如，假设一个字段包含一个 HashMap 实例。将其更改为 EnumMap 将为迭代提供更好的性能和与键的自然顺序，但是你只能在键类型为 enum 类型的情况下使用 EnumMap。将 HashMap 更改为 LinkedHashMap 将提供可预测的迭代顺序，性能与 HashMap 相当，而不需要对键类型作出任何特殊要求。

You might think it’s OK to declare a variable using its implementation type, because you can change the declaration type and the implementation type at the same time, but there is no guarantee that this change will result in a program that compiles. If the client code used methods on the original implementation type that are not also present on its replacement or if the client code passed the instance to a method that requires the original implementation type, then the code will no longer compile after making this change. Declaring the variable with the interface type keeps you honest.

你可能认为使用变量的实现类型声明变量是可以的，因为你可以同时更改声明类型和实现类型，但是不能保证这种更改会正确编译程序。如果客户端代码对原实现类型使用了替换时不存在的方法，或者客户端代码将实例传递给需要原实现类型的方法，那么在进行此更改之后，代码将不再编译。使用接口类型声明变量可以保持一致。

**It is entirely appropriate to refer to an object by a class rather than an interface if no appropriate interface exists.** For example, consider value classes, such as String and BigInteger. Value classes are rarely written with multiple implementations in mind. They are often final and rarely have corresponding interfaces. It is perfectly appropriate to use such a value class as a parameter, variable, field, or return type.

**如果没有合适的接口存在，那么用类引用对象是完全合适的。** 例如，考虑值类，如 String 和 BigInteger。值类很少在编写时考虑到多个实现。它们通常是 final 的，很少有相应的接口。使用这样的值类作为参数、变量、字段或返回类型非常合适。

A second case in which there is no appropriate interface type is that of objects belonging to a framework whose fundamental types are classes rather than interfaces. If an object belongs to such a class-based framework, it is preferable to refer to it by the relevant base class, which is often abstract, rather than by its implementation class. Many java.io classes such as OutputStream fall into this category.

没有合适接口类型的第二种情况是属于框架的对象，框架的基本类型是类而不是接口。如果一个对象属于这样一个基于类的框架，那么最好使用相关的基类来引用它，这通常是抽象的，而不是使用它的实现类。在 java.io 类中许多诸如 OutputStream 之类的就属于这种情况。

A final case in which there is no appropriate interface type is that of classes that implement an interface but also provide extra methods not found in the interface—for example, PriorityQueue has a comparator method that is not present on the Queue interface. Such a class should be used to refer to its instances only if the program relies on the extra methods, and this should be very rare.

没有合适接口类型的最后一种情况是，实现接口但同时提供接口中不存在的额外方法的类，例如，PriorityQueue 有一个在 Queue 接口上不存在的比较器方法。只有当程序依赖于额外的方法时，才应该使用这样的类来引用它的实例，这种情况应该非常少见。

These three cases are not meant to be exhaustive but merely to convey the flavor of situations where it is appropriate to refer to an object by its class. In practice, it should be apparent whether a given object has an appropriate interface. If it does, your program will be more flexible and stylish if you use the interface to refer to the object. **If there is no appropriate interface, just use the least specific class in the class hierarchy that provides the required functionality.**

这三种情况并不是面面俱到的，而仅仅是为了传达适合通过类引用对象的情况。在实际应用中，给定对象是否具有适当的接口应该是显而易见的。如果是这样，如果使用接口引用对象，程序将更加灵活和流行。**如果没有合适的接口，就使用类层次结构中提供所需功能的最底层的类**

---

## 【65】接口优于反射

> Prefer interfaces to reflection

The core reflection facility, java.lang.reflect, offers programmatic access to arbitrary classes. Given a Class object, you can obtain Constructor, Method, and Field instances representing the constructors, methods, and fields of the class represented by the Class instance. These objects provide programmatic access to the class’s member names, field types, method signatures, and so on.

核心反射机制 `java.lang.reflect` 提供对任意类的编程访问。给定一个 Class 对象，你可以获得 Constructor、Method 和 Field 实例，分别代表了该 Class 实例所表示的类的构造器、方法和字段。这些对象提供对类的成员名、字段类型、方法签名等的编程访问。

Moreover, Constructor, Method, and Field instances let you manipulate their underlying counterparts reflectively: you can construct instances, invoke methods, and access fields of the underlying class by invoking methods on the Constructor, Method, and Field instances. For example, Method.invoke lets you invoke any method on any object of any class (subject to the usual security constraints). Reflection allows one class to use another, even if the latter class did not exist when the former was compiled. This power, however, comes at a price:

此外，Constructor、Method 和 Field 实例允许你反射性地操作它们的底层对应项：你可以通过调用 Constructor、Method 和 Field 实例上的方法，可以构造底层类的实例、调用底层类的方法，并访问底层类中的字段。例如，Method.invoke 允许你在任何类的任何对象上调用任何方法（受默认的安全约束）。反射允许一个类使用另一个类，即使在编译前者时后者并不存在。然而，这种能力是有代价的：

- **You lose all the benefits of compile-time type checking,** including exception checking. If a program attempts to invoke a nonexistent or inaccessible method reflectively, it will fail at runtime unless you’ve taken special precautions.

你失去了编译时类型检查的所有好处，包括异常检查。如果一个程序试图反射性地调用一个不存在的或不可访问的方法，它将在运行时失败，除非你采取了特殊的预防措施。

- **The code required to perform reflective access is clumsy and verbose.** It is tedious to write and difficult to read.

执行反射访问所需的代码既笨拙又冗长。写起来很乏味，读起来也很困难。

- **Performance suffers.** Reflective method invocation is much slower than normal method invocation. Exactly how much slower is hard to say, as there are many factors at work. On my machine, invoking a method with no input parameters and an int return was eleven times slower when done reflectively.

性能降低。反射方法调用比普通方法调用慢得多。到底慢了多少还很难说，因为有很多因素在起作用。在我的机器上，调用一个没有输入参数和返回 int 类型的方法时，用反射执行要慢 11 倍。

There are a few sophisticated applications that require reflection. Examples include code analysis tools and dependency injection frameworks. Even such tools have been moving away from reflection of late, as its disadvantages become clearer. If you have any doubts as to whether your application requires reflection, it probably doesn’t.

有一些复杂的应用程序需要反射。包括代码分析工具和依赖注入框架。即使是这样的工具，随着它的缺点变得越来越明显，人们也在逐渐远离并反思这种用法。如果你对应用程序是否需要反射有任何疑问，那么它可能不需要。

**You can obtain many of the benefits of reflection while incurring few of its costs by using it only in a very limited form.** For many programs that must use a class that is unavailable at compile time, there exists at compile time an appropriate interface or superclass by which to refer to the class (Item 64). If this is the case, you can **create instances reflectively and access them normally via their interface or superclass.**

**通过非常有限的形式使用反射，你可以获得反射的许多好处，同时花费的代价很少。** 对于许多程序，它们必须用到在编译时无法获取的类，在编译时存在一个适当的接口或超类来引用该类（Item-64）。如果是这种情况，**可以用反射方式创建实例，并通过它们的接口或超类正常地访问它们。**

For example, here is a program that creates a `Set<String>` instance whose class is specified by the first command line argument. The program inserts the remaining command line arguments into the set and prints it. Regardless of the first argument, the program prints the remaining arguments with duplicates eliminated. The order in which these arguments are printed, however, depends on the class specified in the first argument. If you specify java.util.HashSet, they’re printed in apparently random order; if you specify java.util.TreeSet, they’re printed in alphabetical order because the elements in a TreeSet are sorted:

例如，这是一个创建 `Set<String>` 实例的程序，类由第一个命令行参数指定。程序将剩余的命令行参数插入到集合中并打印出来。不管第一个参数是什么，程序都会打印剩余的参数，并去掉重复项。然而，打印这些参数的顺序取决于第一个参数中指定的类。如果你指定 `java.util.HashSet`，它们显然是随机排列的；如果你指定 `java.util.TreeSet`，它们是按字母顺序打印的，因为 TreeSet 中的元素是有序的：

```java
// Reflective instantiation with interface access
public static void main(String[] args) {

    // Translate the class name into a Class object
    Class<? extends Set<String>> cl = null;
    try {
        cl = (Class<? extends Set<String>>) // Unchecked cast!
        Class.forName(args[0]);
    } catch (ClassNotFoundException e) {
        fatalError("Class not found.");
    }

    // Get the constructor
    Constructor<? extends Set<String>> cons = null;
    try {
        cons = cl.getDeclaredConstructor();
    } catch (NoSuchMethodException e) {
        fatalError("No parameterless constructor");
    }

    // Instantiate the set
    Set<String> s = null;
    try {
        s = cons.newInstance();
    } catch (IllegalAccessException e) {
        fatalError("Constructor not accessible");
    } catch (InstantiationException e) {
        fatalError("Class not instantiable.");
    } catch (InvocationTargetException e) {
        fatalError("Constructor threw " + e.getCause());
    } catch (ClassCastException e) {
        fatalError("Class doesn't implement Set");
    }

    // Exercise the set
    s.addAll(Arrays.asList(args).subList(1, args.length));
    System.out.println(s);
}

private static void fatalError(String msg) {
    System.err.println(msg);
    System.exit(1);
}
```

While this program is just a toy, the technique it demonstrates is quite powerful. The toy program could easily be turned into a generic set tester that validates the specified Set implementation by aggressively manipulating one or more instances and checking that they obey the Set contract. Similarly, it could be turned into a generic set performance analysis tool. In fact, this technique is sufficiently powerful to implement a full-blown service provider framework (Item 1). Usually, this technique is all that you need in the way of reflection.

虽然这个程序只是一个小把戏，但它演示的技术非常强大。这个程序可以很容易地转换成一个通用的集合测试器，通过积极地操作一个或多个实例并检查它们是否遵守 Set 接口约定来验证指定的 Set 实现。类似地，它可以变成一个通用的集合性能分析工具。事实上，该技术足够强大，可以实现一个成熟的服务提供者框架（Item-1）。

This example demonstrates two disadvantages of reflection. First, the example can generate six different exceptions at runtime, all of which would have been compile-time errors if reflective instantiation were not used. (For fun, you can cause the program to generate each of the six exceptions by passing in appropriate command line arguments.) The second disadvantage is that it takes twenty-five lines of tedious code to generate an instance of the class from its name, whereas a constructor invocation would fit neatly on a single line. The length of the program could be reduced by catching ReflectiveOperationException, a superclass of the various reflective exceptions that was introduced in Java 7. Both disadvantages are restricted to the part of the program that instantiates the object. Once instantiated, the set is indistinguishable from any other Set instance. In a real program, the great bulk of the code is thus unaffected by this limited use of reflection.

这个例子也说明了反射的两个缺点。首先，该示例可以在运行时生成六个不同的异常，如果没有使用反射实例化，所有这些异常都将是编译时错误。（有趣的是，你可以通过传入适当的命令行参数，使程序生成六个异常中的每一个。）第二个缺点是，根据类的名称生成类的实例需要 25 行冗长的代码，而构造函数调用只需要一行。通过捕获 ReflectiveOperationException（Java 7 中引入的各种反射异常的超类），可以减少程序的长度。这两个缺点都只限于实例化对象的程序部分。实例化后，与任何其他 Set 实例将难以区分。在实际的程序中，通过这种限定使用反射的方法，大部分代码可以免受影响。

If you compile this program, you’ll get an unchecked cast warning. This warning is legitimate, in that the cast to `Class<? extends Set<String>>` will succeed even if the named class is not a Set implementation, in which case the program with throw a ClassCastException when it instantiates the class. To learn about suppressing the warning, read Item 27.

如果编译此程序，将得到 unchecked 的强制转换警告。这个警告是合法的，即使指定的类不是 Set 实现，`Class<? extends Set<String>>` 也会成功，在这种情况下，程序在实例化类时抛出 ClassCastException。要了解如何抑制警告，请阅读 Item-27。

A legitimate, if rare, use of reflection is to manage a class’s dependencies on other classes, methods, or fields that may be absent at runtime. This can be useful if you are writing a package that must run against multiple versions of some other package. The technique is to compile your package against the minimal environment required to support it, typically the oldest version, and to access any newer classes or methods reflectively. To make this work, you have to take appropriate action if a newer class or method that you are attempting to access does not exist at runtime. Appropriate action might consist of using some alternate means to accomplish the same goal or operating with reduced functionality.

反射的合法用途（很少）是管理类对运行时可能不存在的其他类、方法或字段的依赖关系。如果你正在编写一个包，并且必须针对其他包的多个版本运行，此时反射将非常有用。该技术是根据支持包所需的最小环境（通常是最老的版本）编译包，并反射性地访问任何较新的类或方法。如果你试图访问的新类或方法在运行时不存在，要使此工作正常进行，则必须采取适当的操作。适当的操作可能包括使用一些替代方法来完成相同的目标，或者使用简化的功能进行操作。

In summary, reflection is a powerful facility that is required for certain sophisticated system programming tasks, but it has many disadvantages. If you are writing a program that has to work with classes unknown at compile time, you should, if at all possible, use reflection only to instantiate objects, and access the objects using some interface or superclass that is known at compile time.

总之，反射是一种功能强大的工具，对于某些复杂的系统编程任务是必需的，但是它有很多缺点。如果编写的程序必须在编译时处理未知的类，则应该尽可能只使用反射实例化对象，并使用在编译时已知的接口或超类访问对象。

---

## 【66】明智地使用本地方法

> Use native methods judiciously

The Java Native Interface (JNI) allows Java programs to call native methods, which are methods written in native programming languages such as C or C++. Historically, native methods have had three main uses. They provide access to platform-specific facilities such as registries. They provide access to existing libraries of native code, including legacy libraries that provide access to legacy data. Finally, native methods are used to write performance-critical parts of applications in native languages for improved performance.

Java 本地接口（JNI）允许 Java 程序调用本地方法，这些方法是用 C 或 C++ 等本地编程语言编写的。从历史上看，本地方法主要有三种用途。它们提供对特定于平台的设施（如注册中心）的访问。它们提供对现有本地代码库的访问，包括提供对遗留数据访问。最后，本地方法可以通过本地语言编写应用程序中注重性能的部分，以提高性能。

It is legitimate to use native methods to access platform-specific facilities, but it is seldom necessary: as the Java platform matured, it provided access to many features previously found only in host platforms. For example, the process API, added in Java 9, provides access to OS processes. It is also legitimate to use native methods to use native libraries when no equivalent libraries are available in Java.

使用本地方法访问特定于平台的机制是合法的，但是很少有必要：随着 Java 平台的成熟，它提供了对许多以前只能在宿主平台中上找到的特性。例如，Java 9 中添加的流 API 提供了对 OS 流程的访问。在 Java 中没有等效库时，使用本地方法来使用本地库也是合法的。

**It is rarely advisable to use native methods for improved performance.** In early releases (prior to Java 3), it was often necessary, but JVMs have gotten much faster since then. For most tasks, it is now possible to obtain comparable performance in Java. For example, when java.math was added in release 1.1, BigInteger relied on a then-fast multiprecision arithmetic library written in C. In Java 3, BigInteger was reimplemented in Java, and carefully tuned to the point where it ran faster than the original native implementation.

**为了提高性能，很少建议使用本地方法。** 在早期版本（Java 3 之前），这通常是必要的，但是从那时起 JVM 变得更快了。对于大多数任务，现在可以在 Java 中获得类似的性能。例如，在版本 1.1 中添加了 `java.math`，BigInteger 是在一个用 C 编写的快速多精度运算库的基础上实现的。在当时，为了获得足够的性能这样做是必要的。在 Java 3 中，BigInteger 则完全用 Java 重写了，并且进行了性能调优，新的版本比原来的版本更快。

A sad coda to this story is that BigInteger has changed little since then, with the exception of faster multiplication for large numbers in Java 8. In that time, work continued apace on native libraries, notably GNU Multiple Precision arithmetic library (GMP). Java programmers in need of truly high-performance multiprecision arithmetic are now justified in using GMP via native methods [Blum14].

这个故事的一个可悲的结尾是，除了在 Java 8 中对大数进行更快的乘法运算之外，BigInteger 此后几乎没有发生什么变化。在此期间，对本地库的工作继续快速进行，尤其是 GNU 多精度算术库（GMP）。需要真正高性能多精度算法的 Java 程序员现在可以通过本地方法使用 GMP [Blum14]。

The use of native methods has serious disadvantages. Because native languages are not safe (Item 50), applications using native methods are no longer immune to memory corruption errors. Because native languages are more platform-dependent than Java, programs using native methods are less portable. They are also harder to debug. If you aren’t careful, native methods can decrease performance because the garbage collector can’t automate, or even track, native memory usage (Item 8), and there is a cost associated with going into and out of native code. Finally, native methods require “glue code” that is difficult to read and tedious to write.

使用本地方法有严重的缺点。由于本地语言不安全（Item-50），使用本地方法的应用程序不再能免受内存毁坏错误的影响。由于本地语言比 Java 更依赖于平台，因此使用本地方法的程序的可移植性较差。它们也更难调试。如果不小心，本地方法可能会降低性能，因为垃圾收集器无法自动跟踪本地内存使用情况（Item-8，而且进出本地代码会产生相关的成本。最后，本地方法需要「粘合代码」，这很难阅读，而且编写起来很乏味。

In summary, think twice before using native methods. It is rare that you need to use them for improved performance. If you must use native methods to access low-level resources or native libraries, use as little native code as possible and test it thoroughly. A single bug in the native code can corrupt your entire application.

总之，在使用本地方法之前要三思。一般很少需要使用它们来提高性能。如果必须使用本地方法来访问底层资源或本地库，请尽可能少地使用本地代码，并对其进行彻底的测试。本地代码中的一个错误就可以破坏整个应用程序。

---

## 【67】明智地进行优化

> Optimize judiciously

There are three aphorisms concerning optimization that everyone should know:

有三条关于优化的格言是每个人都应该知道的：

More computing sins are committed in the name of efficiency (without necessarily achieving it) than for any other single reason—including blind stupidity.

比起其他任何单一的原因（包括盲目的愚蠢），很多计算上的过失都被归昝于效率（不一定能实现）。

—William A. Wulf [Wulf72]

We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil.

不要去计较效率上的一些小小的得失，在 97% 的情况下，不成熟的优化才是一切问题的根源。

—Donald E. Knuth [Knuth74]

We follow two rules in the matter of optimization:
Rule 1. Don’t do it.
Rule 2 (for experts only). Don’t do it yet—that is, not until you have a perfectly clear and unoptimized solution.

在优化方面，我们应该遵守两条规则：

规则 1：不要进行优化。

规则 2 （仅针对专家）：还是不要进行优化，也就是说，在你还没有绝对清晰的未优化方案之前，请不要进行优化。

—M. A. Jackson [Jackson75]

All of these aphorisms predate the Java programming language by two decades. They tell a deep truth about optimization: it is easy to do more harm than good, especially if you optimize prematurely. In the process, you may produce software that is neither fast nor correct and cannot easily be fixed.

所有这些格言都比 Java 编程语言早了 20 年。它们告诉我们关于优化的一个深刻的事实：很容易弊大于利，尤其是如果过早地进行优化。在此过程中，你可能会生成既不快速也不正确且无法轻松修复的软件。

Don’t sacrifice sound architectural principles for performance. Strive to write **good programs rather than fast ones.** If a good program is not fast enough, its architecture will allow it to be optimized. Good programs embody the principle of information hiding: where possible, they localize design decisions within individual components, so individual decisions can be changed without affecting the remainder of the system (Item 15).

不要为了性能而牺牲合理的架构。努力编写 **好的程序，而不是快速的程序。** 如果一个好的程序不够快，它的架构将允许它被优化。好的程序体现了信息隐藏的原则：在可能的情况下，它们在单个组件中本地化设计决策，因此可以在不影响系统其余部分的情况下更改单个决策（Item-15）。

This does not mean that you can ignore performance concerns until your program is complete. Implementation problems can be fixed by later optimization, but pervasive architectural flaws that limit performance can be impossible to fix without rewriting the system. Changing a fundamental facet of your design after the fact can result in an ill-structured system that is difficult to maintain and evolve. Therefore you must think about performance during the design process.

这并不意味着在程序完成之前可以忽略性能问题。实现上的问题可以通过以后的优化来解决，但是对于架构缺陷，如果不重写系统，就不可能解决限制性能的问题。在系统完成之后再改变设计的某个基本方面可能导致结构不良的系统难以维护和进化。因此，你必须在设计过程中考虑性能。

**Strive to avoid design decisions that limit performance.** The components of a design that are most difficult to change after the fact are those specifying interactions between components and with the outside world. Chief among these design components are APIs, wire-level protocols, and persistent data formats. Not only are these design components difficult or impossible to change after the fact, but all of them can place significant limitations on the performance that a system can ever achieve.

**尽量避免限制性能的设计决策。** 设计中最难以更改的组件是那些指定组件之间以及与外部世界的交互的组件。这些设计组件中最主要的是 API、线路层协议和持久数据格式。这些设计组件不仅难以或不可能在事后更改，而且所有这些组件都可能对系统能够达到的性能造成重大限制。

**Consider the performance consequences of your API design decisions.** Making a public type mutable may require a lot of needless defensive copying (Item 50). Similarly, using inheritance in a public class where composition would have been appropriate ties the class forever to its superclass, which can place artificial limits on the performance of the subclass (Item 18). As a final example, using an implementation type rather than an interface in an API ties you to a specific implementation, even though faster implementations may be written in the future (Item 64).

**考虑 API 设计决策的性能结果。** 使公共类型转化为可变，可能需要大量不必要的防御性复制（Item-50）。类似地，在一个公共类中使用继承（在这个类中组合将是合适的）将该类永远绑定到它的超类，这会人为地限制子类的性能（Item-18）。最后一个例子是，在 API 中使用实现类而不是接口将你绑定到特定的实现，即使将来可能会编写更快的实现也无法使用（Item-64）。

The effects of API design on performance are very real. Consider the getSize method in the java.awt.Component class. The decision that this performance-critical method was to return a Dimension instance, coupled with the decision that Dimension instances are mutable, forces any implementation of this method to allocate a new Dimension instance on every invocation. Even though allocating small objects is inexpensive on a modern VM, allocating millions of objects needlessly can do real harm to performance.

API 设计对性能的影响是非常实际的。考虑 `java.awt.Component` 中的 getSize 方法。该性能很关键方法返回 Dimension 实例的决定，加上维度实例是可变的决定，强制该方法的任何实现在每次调用时分配一个新的 Dimension 实例。尽管在现代 VM 上分配小对象并不昂贵，但不必要地分配数百万个对象也会对性能造成实际损害。

Several API design alternatives existed. Ideally, Dimension should have been immutable (Item 17); alternatively, getSize could have been replaced by two methods returning the individual primitive components of a Dimension object. In fact, two such methods were added to Component in Java 2 for performance reasons. Preexisting client code, however, still uses the getSize method and still suffers the performance consequences of the original API design decisions.

存在几种 API 设计替代方案。理想情况下，Dimension 应该是不可变的（Item-17）；或者，getSize 可以被返回 Dimension 对象的原始组件的两个方法所替代。事实上，出于性能原因，在 Java 2 的组件中添加了两个这样的方法。然而，现有的客户端代码仍然使用 getSize 方法，并且仍然受到原始 API 设计决策的性能影响。

Luckily, it is generally the case that good API design is consistent with good performance. **It is a very bad idea to warp an API to achieve good performance.** The performance issue that caused you to warp the API may go away in a future release of the platform or other underlying software, but the warped API and the support headaches that come with it will be with you forever.

幸运的是，通常情况下，好的 API 设计与好的性能是一致的。**为了获得良好的性能而改变 API 是一个非常糟糕的想法。** 导致你改变 API 的性能问题，可能在平台或其他底层软件的未来版本中消失，但是改变的 API 和随之而来的问题将永远伴随着你。

Once you’ve carefully designed your program and produced a clear, concise, and well-structured implementation, then it may be time to consider optimization, assuming you’re not already satisfied with the performance of the program.

一旦你仔细地设计了你的程序，成了一个清晰、简洁、结构良好的实现，那么可能是时候考虑优化了，假设此时你还不满意程序的性能。

Recall that Jackson’s two rules of optimization were “Don’t do it,” and “(for experts only). Don’t do it yet.” He could have added one more: **measure performance before and after each attempted optimization.** You may be surprised by what you find. Often, attempted optimizations have no measurable effect on performance; sometimes, they make it worse. The main reason is that it’s difficult to guess where your program is spending its time. The part of the program that you think is slow may not be at fault, in which case you’d be wasting your time trying to optimize it. Common wisdom says that programs spend 90 percent of their time in 10 percent of their code.

记得 Jackson 的两条优化规则是「不要做」和「（只针对专家）」。先别这么做。他本可以再加一个：**在每次尝试优化之前和之后测量性能。** 你可能会对你的发现感到惊讶。通常，试图做的优化通常对于性能并没有明显的影响；有时候，还让事情变得更糟。主要原因是很难猜测程序将时间花费在哪里。程序中你认为很慢的部分可能并没有问题，在这种情况下，你是在浪费时间来优化它。一般认为，程序将 90% 的时间花费在了 10% 的代码上。

Profiling tools can help you decide where to focus your optimization efforts. These tools give you runtime information, such as roughly how much time each method is consuming and how many times it is invoked. In addition to focusing your tuning efforts, this can alert you to the need for algorithmic changes. If a quadratic (or worse) algorithm lurks inside your program, no amount of tuning will fix the problem. You must replace the algorithm with one that is more efficient. The more code in the system, the more important it is to use a profiler. It’s like looking for a needle in a haystack: the bigger the haystack, the more useful it is to have a metal detector. Another tool that deserves special mention is jmh, which is not a profiler but a microbenchmarking framework that provides unparalleled visibility into the detailed performance of Java code [JMH].

分析工具可以帮助你决定将优化工作的重点放在哪里。这些工具提供了运行时信息，比如每个方法大约花费多少时间以及调用了多少次。除了关注你的调优工作之外，这还可以提醒你是否需要改变算法。如果程序中潜伏着平方级（或更差）的算法，那么再多的调优也无法解决这个问题。你必须用一个更有效的算法来代替这个算法。系统中的代码越多，使用分析器就越重要。这就像大海捞针：大海越大，金属探测器就越有用。另一个值得特别提及的工具是 jmh，它不是一个分析器，而是一个微基准测试框架，提供了对 Java 代码性能无与伦比的预测性。

The need to measure the effects of attempted optimization is even greater in Java than in more traditional languages such as C and C++, because Java has a weaker performance model: The relative cost of the various primitive operations is less well defined. The “abstraction gap” between what the programmer writes and what the CPU executes is greater, which makes it even more difficult to reliably predict the performance consequences of optimizations. There are plenty of performance myths floating around that turn out to be half-truths or outright lies.

与 C 和 C++ 等更传统的语言相比，Java 甚至更需要度量尝试优化的效果，因为 Java 的性能模型更弱：各种基本操作的相对成本没有得到很好的定义。程序员编写的内容和 CPU 执行的内容之间的「抽象鸿沟」更大，这使得可靠地预测优化的性能结果变得更加困难。有很多关于性能的传说流传开来，但最终被证明是半真半假或彻头彻尾的谎言。

Not only is Java’s performance model ill-defined, but it varies from implementation to implementation, from release to release, and from processor to processor. If you will be running your program on multiple implementations or multiple hardware platforms, it is important that you measure the effects of your optimization on each. Occasionally you may be forced to make trade-offs between performance on different implementations or hardware platforms.

Java 的性能模型不仅定义不清，而且在不同的实现、不同的发布版本、不同的处理器之间都有所不同。如果你要在多个实现或多个硬件平台上运行程序，那么度量优化对每个平台的效果是很重要的。有时候，你可能会被迫在不同实现或硬件平台上的性能之间进行权衡。

In the nearly two decades since this item was first written, every component of the Java software stack has grown in complexity, from processors to VMs to libraries, and the variety of hardware on which Java runs has grown immensely. All of this has combined to make the performance of Java programs even less predictable now than it was in 2001, with a corresponding increase in the need to measure it.

自本条目首次编写以来的近 20 年里，Java 软件栈的每个组件都变得越来越复杂，从处理器到 vm 再到库，Java 运行的各种硬件都有了极大的增长。所有这些加在一起，使得 Java 程序的性能比 2001 年更难以预测，而对它进行度量的需求也相应增加。

To summarize, do not strive to write fast programs—strive to write good ones; speed will follow. But do think about performance while you’re designing systems, especially while you’re designing APIs, wire-level protocols, and persistent data formats. When you’ve finished building the system, measure its performance. If it’s fast enough, you’re done. If not, locate the source of the problem with the aid of a profiler and go to work optimizing the relevant parts of the system. The first step is to examine your choice of algorithms: no amount of low-level optimization can make up for a poor choice of algorithm. Repeat this process as necessary, measuring the performance after every change, until you’re satisfied.

总而言之，不要努力写快的程序，要努力写好程序；速度自然会提高。但是在设计系统时一定要考虑性能，特别是在设计 API、线路层协议和持久数据格式时。当你完成了系统的构建之后，请度量它的性能。如果足够快，就完成了。如果没有，利用分析器找到问题的根源，并对系统的相关部分进行优化。第一步是检查算法的选择：再多的底层优化也不能弥补算法选择的不足。根据需要重复这个过程，在每次更改之后测量性能，直到你满意为止。

---

## 【68】遵守被广泛认可的命名约定

> Adhere to generally accepted naming conventions

The Java platform has a well-established set of naming conventions, many of which are contained in The Java Language Specification [JLS, 6.1]. Loosely speaking, naming conventions fall into two categories: typographical and grammatical.

Java 平台有一组完善的命名约定，其中许多约定包含在《The Java Language Specification》[JLS, 6.1]。不严格地讲，命名约定分为两类：排版和语法。

There are only a handful of typographical naming conventions, covering packages, classes, interfaces, methods, fields, and type variables. You should rarely violate them and never without a very good reason. If an API violates these conventions, it may be difficult to use. If an implementation violates them, it may be difficult to maintain. In both cases, violations have the potential to confuse and irritate other programmers who work with the code and can cause faulty assumptions that lead to errors. The conventions are summarized in this item.

有少量的与排版有关的命名约定，包括包、类、接口、方法、字段和类型变量。如果没有很好的理由，你不应该违反它们。如果 API 违反了这些约定，那么它可能很难使用。如果实现违反了这些规则，可能很难维护。在这两种情况下，违规都有可能使其他使用代码的程序员感到困惑和恼怒，并使他们做出错误的假设，从而导致错误。本条目概述了各项约定。

Package and module names should be hierarchical with the components separated by periods. Components should consist of lowercase alphabetic characters and, rarely, digits. The name of any package that will be used outside your organization should begin with your organization’s Internet domain name with the components reversed, for example, edu.cmu, com.google, org.eff. The standard libraries and optional packages, whose names begin with java and javax, are exceptions to this rule. Users must not create packages or modules whose names begin with java or javax. Detailed rules for converting Internet domain names to package name prefixes can be found in the JLS [JLS, 6.1].

包名和模块名应该是分层的，组件之间用句点分隔。组件应该由小写字母组成，很少使用数字。任何在你的组织外部使用的包，名称都应该以你的组织的 Internet 域名开头，并将组件颠倒过来，例如，edu.cmu、com.google、org.eff。以 java 和 javax 开头的标准库和可选包是这个规则的例外。用户不能创建名称以 java 或 javax 开头的包或模块。将 Internet 域名转换为包名前缀的详细规则可以在《The Java Language Specification》[JLS, 6.1] 中找到。

The remainder of a package name should consist of one or more components describing the package. Components should be short, generally eight or fewer characters. Meaningful abbreviations are encouraged, for example, util rather than utilities. Acronyms are acceptable, for example, awt. Components should generally consist of a single word or abbreviation.

包名的其余部分应该由描述包的一个或多个组件组成。组件应该很短，通常为 8 个或更少的字符。鼓励使用有意义的缩写，例如 util 而不是 utilities。缩写词是可以接受的，例如 awt。组件通常应该由一个单词或缩写组成。

Many packages have names with just one component in addition to the Internet domain name. Additional components are appropriate for large facilities whose size demands that they be broken up into an informal hierarchy. For example, the javax.util package has a rich hierarchy of packages with names such as java.util.concurrent.atomic. Such packages are known as subpackages, although there is almost no linguistic support for package hierarchies.

除了 Internet 域名之外，许多包的名称只有一个组件。附加组件适用于大型工具包，这些工具包的大小要求将其分解为非正式的层次结构。例如 `javax.util` 包具有丰富的包层次结构，包的名称如 `java.util.concurrent.atomic`。这样的包称为子包，尽管 Java 几乎不支持包层次结构。

Class and interface names, including enum and annotation type names, should consist of one or more words, with the first letter of each word capitalized, for example, List or FutureTask. Abbreviations are to be avoided, except for acronyms and certain common abbreviations like max and min. There is some disagreement as to whether acronyms should be uppercase or have only their first letter capitalized. While some programmers still use uppercase, a strong argument can be made in favor of capitalizing only the first letter: even if multiple acronyms occur back-to-back, you can still tell where one word starts and the next word ends. Which class name would you rather see, HTTPURL or HttpUrl?

类和接口名称，包括枚举和注释类型名称，应该由一个或多个单词组成，每个单词的首字母大写，例如 List 或 FutureTask。除了缩略语和某些常见的缩略语，如 max 和 min，缩略语应该避免使用。缩略语应该全部大写，还是只有首字母大写，存在一些分歧。虽然有些程序员仍然使用大写字母，但支持只将第一个字母大写的理由很充分：即使多个首字母缩写连续出现，你仍然可以知道一个单词从哪里开始，下一个单词从哪里结束。你希望看到哪个类名，HTTPURL 还是 HttpUrl？

Method and field names follow the same typographical conventions as class and interface names, except that the first letter of a method or field name should be lowercase, for example, remove or ensureCapacity. If an acronym occurs as the first word of a method or field name, it should be lowercase.

方法和字段名遵循与类和接口名相同的排版约定，除了方法或字段名的第一个字母应该是小写，例如 remove 或 ensureCapacity。如果方法或字段名的首字母缩写出现在第一个单词中，那么它应该是小写的。

The sole exception to the previous rule concerns “constant fields,” whose names should consist of one or more uppercase words separated by the underscore character, for example, VALUES or NEGATIVE_INFINITY. A constant field is a static final field whose value is immutable. If a static final field has a primitive type or an immutable reference type (Item 17), then it is a constant field. For example, enum constants are constant fields. If a static final field has a mutable reference type, it can still be a constant field if the referenced object is immutable. Note that constant fields constitute the only recommended use of underscores.

前面规则的唯一例外是「常量字段」，它的名称应该由一个或多个大写单词组成，由下划线分隔，例如 VALUES 或 NEGATIVE_INFINITY。常量字段是一个静态的 final 字段，其值是不可变的。如果静态 final 字段具有基本类型或不可变引用类型(第 17 项)，那么它就是常量字段。例如，枚举常量是常量字段。如果静态 final 字段有一个可变的引用类型，那么如果所引用的对象是不可变的，那么它仍然可以是一个常量字段。注意，常量字段是唯一推荐使用下划线用法的。

Local variable names have similar typographical naming conventions to member names, except that abbreviations are permitted, as are individual characters and short sequences of characters whose meaning depends on the context in which they occur, for example, i, denom, houseNum. Input parameters are a special kind of local variable. They should be named much more carefully than ordinary local variables, as their names are an integral part of their method’s documentation.

局部变量名与成员名具有类似的排版命名约定，但允许使用缩写，也允许使用单个字符和短字符序列，它们的含义取决于它们出现的上下文，例如 i、denom、houseNum。输入参数是一种特殊的局部变量。它们的命名应该比普通的局部变量谨慎得多，因为它们的名称是方法文档的组成部分。

Type parameter names usually consist of a single letter. Most commonly it is one of these five: T for an arbitrary type, E for the element type of a collection, K and V for the key and value types of a map, and X for an exception. The return type of a function is usually R. A sequence of arbitrary types can be T, U, V or T1, T2, T3.

类型参数名通常由单个字母组成。最常见的是以下五种类型之一：T 表示任意类型，E 表示集合的元素类型，K 和 V 表示 Map 的键和值类型，X 表示异常。函数的返回类型通常为 R。任意类型的序列可以是 T、U、V 或 T1、T2、T3。

For quick reference, the following table shows examples of typographical conventions.

为了快速参考，下表显示了排版约定的示例。

|  Identifier Type   |                       Example                        |
| :----------------: | :--------------------------------------------------: |
| Package or module  | `org.junit.jupiter.api`, `com.google.common.collect` |
| Class or Interface |     Stream, FutureTask, LinkedHashMap,HttpClient     |
|  Method or Field   |              remove, groupingBy, getCrc              |
|   Constant Field   |             MIN_VALUE, NEGATIVE_INFINITY             |
|   Local Variable   |                  i, denom, houseNum                  |
|   Type Parameter   |            T, E, K, V, X, R, U, V, T1, T2            |

Grammatical naming conventions are more flexible and more controversial than typographical conventions. There are no grammatical naming conventions to speak of for packages. Instantiable classes, including enum types, are generally named with a singular noun or noun phrase, such as Thread, PriorityQueue, or ChessPiece. Non-instantiable utility classes (Item 4) are often named with a plural noun, such as Collectors or Collections. Interfaces are named like classes, for example, Collection or Comparator, or with an adjective ending in able or ible, for example, Runnable, Iterable, or Accessible. Because annotation types have so many uses, no part of speech predominates. Nouns, verbs, prepositions, and adjectives are all common, for example, BindingAnnotation, Inject, ImplementedBy, or Singleton.

语法命名约定比排版约定更灵活，也更有争议。包没有语法命名约定。可实例化的类，包括枚举类型，通常使用一个或多个名词短语来命名，例如 Thread、PriorityQueue 或 ChessPiece。不可实例化的实用程序类（Item-4）通常使用复数名词来命名，例如 collector 或 Collections。接口的名称类似于类，例如集合或比较器，或者以 able 或 ible 结尾的形容词，例如 Runnable、Iterable 或 Accessible。因为注解类型有很多的用途，所以没有哪部分占主导地位。名词、动词、介词和形容词都很常见，例如，BindingAnnotation、Inject、ImplementedBy 或 Singleton。

Methods that perform some action are generally named with a verb or verb phrase (including object), for example, append or drawImage. Methods that return a boolean value usually have names that begin with the word is or, less commonly, has, followed by a noun, noun phrase, or any word or phrase that functions as an adjective, for example, isDigit, isProbablePrime, isEmpty, isEnabled, or hasSiblings.

执行某些操作的方法通常用动词或动词短语（包括对象）命名，例如，append 或 drawImage。返回布尔值的方法的名称通常以单词 is 或 has（通常很少用）开头，后面跟一个名词、一个名词短语，或者任何用作形容词的单词或短语，例如 isDigit、isProbablePrime、isEmpty、isEnabled 或 hasSiblings。

Methods that return a non-boolean function or attribute of the object on which they’re invoked are usually named with a noun, a noun phrase, or a verb phrase beginning with the verb get, for example, size, hashCode, or getTime. There is a vocal contingent that claims that only the third form (beginning with get) is acceptable, but there is little basis for this claim. The first two forms usually lead to more readable code, for example:

返回被调用对象的非布尔函数或属性的方法通常使用以 get 开头的名词、名词短语或动词短语来命名，例如 size、hashCode 或 getTime。有一种说法是，只有第三种形式（以 get 开头）才是可接受的，但这种说法几乎没有根据。前两种形式的代码通常可读性更强，例如：

```java
if (car.speed() > 2 * SPEED_LIMIT)
    generateAudibleAlert("Watch out for cops!");
```

The form beginning with get has its roots in the largely obsolete Java Beans specification, which formed the basis of an early reusable component architecture. There are modern tools that continue to rely on the Beans naming convention, and you should feel free to use it in any code that is to be used in conjunction with these tools. There is also a strong precedent for following this naming convention if a class contains both a setter and a getter for the same attribute. In this case, the two methods are typically named getAttribute and setAttribute.

以 get 开头的表单起源于基本过时的 Java bean 规范，该规范构成了早期可重用组件体系结构的基础。有一些现代工具仍然依赖于 bean 命名约定，你应该可以在任何与这些工具一起使用的代码中随意使用它。如果类同时包含相同属性的 setter 和 getter，则遵循这种命名约定也有很好的先例。在本例中，这两个方法通常被命名为 getAttribute 和 setAttribute。

A few method names deserve special mention. Instance methods that convert the type of an object, returning an independent object of a different type, are often called toType, for example, toString or toArray. Methods that return a view (Item 6) whose type differs from that of the receiving object are often called asType, for example, asList. Methods that return a primitive with the same value as the object on which they’re invoked are often called typeValue, for example, intValue. Common names for static factories include from, of, valueOf, instance, getInstance, newInstance, getType, and newType (Item 1, page 9).

一些方法名称值得特别注意。转换对象类型（返回不同类型的独立对象）的实例方法通常称为 toType，例如 toString 或 toArray。返回与接收对象类型不同的视图（Item-6）的方法通常称为 asType，例如 asList。返回与调用它们的对象具有相同值的基本类型的方法通常称为类型值，例如 intValue。静态工厂的常见名称包括 from、of、valueOf、instance、getInstance、newInstance、getType 和 newType（Item-1，第 9 页）。

Grammatical conventions for field names are less well established and less important than those for class, interface, and method names because welldesigned APIs contain few if any exposed fields. Fields of type boolean are often named like boolean accessor methods with the initial is omitted, for example, initialized, composite. Fields of other types are usually named with nouns or noun phrases, such as height, digits, or bodyStyle. Grammatical conventions for local variables are similar to those for fields but even weaker.

字段名的语法约定没有类、接口和方法名的语法约定建立得好，也不那么重要，因为设计良好的 API 包含很少的公开字段。类型为 boolean 的字段的名称通常类似于 boolean 访问器方法，省略了初始值「is」，例如 initialized、composite。其他类型的字段通常用名词或名词短语来命名，如 height、digits 和 bodyStyle。局部变量的语法约定类似于字段的语法约定，但要求更少。

To summarize, internalize the standard naming conventions and learn to use them as second nature. The typographical conventions are straightforward and largely unambiguous; the grammatical conventions are more complex and looser. To quote from The Java Language Specification [JLS, 6.1], “These conventions should not be followed slavishly if long-held conventional usage dictates otherwise.” Use common sense.

总之，将标准命名约定内在化，并将其作为第二性征来使用。排版习惯是直接的，而且在很大程度上是明确的；语法惯例更加复杂和松散。引用《The JavaLanguage Specification》[JLS, 6.1] 中的话说，「如果长期以来的传统用法要求不遵循这些约定，就不应该盲目地遵循这些约定。」，应使用常识判断。
