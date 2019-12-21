# 第 3 章 对象的通用方法

## 【10】覆盖 equals 方法时应遵守的约定

> Obey the general contract when overriding equals

Overriding the equals method seems simple, but there are many ways to get it wrong, and consequences can be dire. The easiest way to avoid problems is not to override the equals method, in which case each instance of the class is equal only to itself. This is the right thing to do if any of the following conditions apply:

> 覆盖 equals 方法似乎很简单，但是有很多覆盖的方式会导致出错，而且后果可能非常严重。避免问题的最简单方法是不覆盖 equals 方法，在这种情况下，类的每个实例都只等于它自己。如果符合下列任何条件，就是正确的做法：

- **Each instance of the class is inherently unique.** This is true for classes such as Thread that represent active entities rather than values. The equals implementation provided by Object has exactly the right behavior for these classes.

> **类的每个实例本质上都是唯一的。** 对于像 Thread 这样表示活动实体类而不是值类来说也是如此。Object 提供的 equals 实现对于这些类具有完全正确的行为。

- **There is no need for the class to provide a “logical equality” test.** For example, java.util.regex.Pattern could have overridden equals to check whether two Pattern instances represented exactly the same regular expression, but the designers didn’t think that clients would need or want this functionality. Under these circumstances, the equals implementation inherited from Object is ideal.

> **该类不需要提供「逻辑相等」测试。** 例如，`java.util.regex.Pattern` 可以覆盖 equals 来检查两个 Pattern 实例是否表示完全相同的正则表达式，但设计人员认为客户端不需要或不需要这个功能。在这种情况下，从 Object 继承的 equals 实现是理想的。

- **A superclass has already overridden equals, and the superclass behavior is appropriate for this class.** For example, most Set implementations inherit their equals implementation from AbstractSet, List implementations from AbstractList, and Map implementations from AbstractMap.

> **超类已经覆盖了 equals，超类行为适合于这个类。** 例如，大多数 Set 的实现从 AbstractSet 继承其对等实现，List 从 AbstractList 继承实现，Map 从 AbstractMap 继承实现。

- **The class is private or package-private, and you are certain that its equals method will never be invoked.** If you are extremely risk-averse,you can override the equals method to ensure that it isn’t invoked accidentally:

> **类是私有的或包私有的，并且你确信它的 equals 方法永远不会被调用。** 如果你非常厌恶风险，你可以覆盖 equals 方法，以确保它不会意外调用：

```java
@Override
public boolean equals(Object o) {
    throw new AssertionError(); // Method is never called
}
```

So when is it appropriate to override equals? It is when a class has a notion of logical equality that differs from mere object identity and a superclass has not already overridden equals. This is generally the case for value classes. A value class is simply a class that represents a value, such as Integer or String. A programmer who compares references to value objects using the equals method expects to find out whether they are logically equivalent, not whether they refer to the same object. Not only is overriding the equals method necessary to satisfy programmer expectations, it enables instances to serve as map keys or set elements with predictable, desirable behavior.

> 什么时候覆盖 equals 方法是合适的？当一个类有一个逻辑相等的概念，而这个概念不同于仅判断对象的同一性（相同对象的引用），并且超类还没有覆盖 equals。对于值类通常是这样。值类只是表示值的类，例如 Integer 或 String。使用 equals 方法比较引用和值对象的程序员希望发现它们在逻辑上是否等价，而不是它们是否引用相同的对象。覆盖 equals 方法不仅是为了满足程序员的期望，它还使实例能够作为 Map 的键或 Set 元素时，具有可预测的、理想的行为。

**译注 1：有一个表示状态的内部类。没有覆盖 equals 方法时，equals 的结果与 s1==s2 相同，为 false，即两者并不是相同对象的引用。**

```java
public static void main(String[] args) {

    class Status {
        public String status;
    }

    Status s1 = new Status();
    Status s2 = new Status();

    System.out.println(s1==s2); // false
    System.out.println(s1.equals(s2)); // false
}
```

**译注 2：覆盖 equals 方法后，以业务逻辑来判断是否相同，具备相同 status 字段即为相同。在使用去重功能时，也以此作为判断依据。**

```java
public static void main(String[] args) {

    class Status {
        public String status;

        @Override
        public boolean equals(Object o) {
            return Objects.equals(status, ((Status) o).status);
        }
    }

    Status s1 = new Status();
    Status s2 = new Status();

    System.out.println(s1==s2); // false
    System.out.println(s1.equals(s2)); // true
}
```

One kind of value class that does not require the equals method to be overridden is a class that uses instance control (Item 1) to ensure that at most one object exists with each value. Enum types (Item 34) fall into this category. For these classes, logical equality is the same as object identity, so Object’s equals method functions as a logical equals method.

> 不需要覆盖 equals 方法的一种值类是使用实例控件（Item-1）来确保每个值最多只存在一个对象的类。枚举类型（Item-34）属于这一类。对于这些类，逻辑相等与对象标识相同，因此对象的 equals 方法函数与逻辑 equals 方法相同。

When you override the equals method, you must adhere to its general contract. Here is the contract, from the specification（n.规范，说明书） for Object :

> 当你覆盖 equals 方法时，你必须遵守它的通用约定。以下是具体内容，来自 Object 规范：

The equals method implements an equivalence relation. It has these properties:

> equals 方法实现了等价关系。它应有这些属性：

- Reflexive: For any non-null reference value x, x.equals(x) must return true.

> 反身性：对于任何非空的参考值 x，`x.equals(x)` 必须返回 true。

- Symmetric: For any non-null reference values x and y, x.equals(y) must return true if and only if y.equals(x) returns true.

> 对称性：对于任何非空参考值 x 和 y，`x.equals(y)` 必须在且仅当 `y.equals(x)` 返回 true 时返回 true。

- Transitive: For any non-null reference values x, y, z, if x.equals(y) returns true and y.equals(z) returns true, then x.equals(z) must return true.

> 传递性：对于任何非空的引用值 x, y, z，如果 `x.equals(y)` 返回 true，`y.equals(z)` 返回 true，那么 `x.equals(z)` 必须返回 true。

- Consistent: For any non-null reference values x and y, multiple invocations of x.equals(y) must consistently return true or consistently return false, provided no information used in equals comparisons is modified.

> 一致性：对于任何非空的引用值 x 和 y, `x.equals(y)` 的多次调用必须一致地返回 true 或一致地返回 false，前提是不修改 equals 中使用的信息。

- For any non-null reference value x, x.equals(null) must return false.

> 对于任何非空引用值 x，`x.equals(null)` 必须返回 false。

Unless you are mathematically inclined（v.使…倾向；adj.趋向于…的）, this might look a bit scary, but do not ignore it! If you violate it, you may well find that your program behaves erratically or crashes, and it can be very difficult to pin down the source of the failure. To paraphrase John Donne, no class is an island. Instances of one class are frequently passed to another. Many classes, including all collections classes,depend on the objects passed to them obeying the equals contract.

> 除非你有数学方面的倾向，否则这些起来有点可怕，但不要忽略它！如果你违反了它，你的程序很可能会出现行为异常或崩溃，并且很难确定失败的根源。用 John Donne 的话来说，没有一个类是孤立的。一个类的实例经常被传递给另一个类。许多类（包括所有集合类）依赖于传递给它们的对象遵守 equals 约定。

Now that you are aware of the dangers of violating the equals contract, let’s go over the contract in detail. The good news is that, appearances notwithstanding, it really isn’t very complicated. Once you understand it, it’s not hard to adhere to it.

> 既然你已经意识到了违反 equals 约定的危险，让我们详细讨论一下。好消息是，尽管表面上看起来很复杂，但其实并不复杂。一旦你明白了，就不难坚持下去了。

So what is an equivalence relation? Loosely speaking, it’s an operator that partitions a set of elements into subsets whose elements are deemed equal to one another. These subsets are known as equivalence classes. For an equals method to be useful, all of the elements in each equivalence class must be interchangeable from the perspective of the user. Now let’s examine the five requirements in turn:

> 什么是等价关系？简单地说，它是一个操作符，它将一组元素划分为子集，子集的元素被认为是彼此相等的。这些子集被称为等价类。为了使 equals 方法有用，从用户的角度来看，每个等价类中的所有元素都必须是可互换的。现在让我们依次检查以下五个需求：

**Reflexivity** —The first requirement says merely that an object must be equal to itself. It’s hard to imagine violating this one unintentionally. If you were to violate it and then add an instance of your class to a collection, the contains method might well say that the collection didn’t contain the instance that you just added.

> **反身性** ，第一个要求仅仅是说一个对象必须等于它自己。很难想象会无意中违反了这条规则。如果你违反了它，然后将类的一个实例添加到集合中，contains 方法很可能会说该集合不包含你刚才添加的实例。

**Symmetry** —The second requirement says that any two objects must agree on whether they are equal. Unlike the first requirement, it’s not hard to imagine violating this one unintentionally. For example, consider the following class,which implements a case-insensitive string. The case of the string is preserved by toString but ignored in equals comparisons:

> **对称性** ，第二个要求是任何两个对象必须在是否相等的问题上达成一致。与第一个要求不同，无意中违反了这个要求的情况不难想象。例如，考虑下面的类，它实现了不区分大小写的字符串。字符串的情况是保留的 toString，但忽略在 equals 的比较：

```java
// Broken - violates symmetry!
public final class CaseInsensitiveString {
    private final String s;

    public CaseInsensitiveString(String s) {
        this.s = Objects.requireNonNull(s);
}

// Broken - violates symmetry!
@Override
public boolean equals(Object o) {
    if (o instanceof CaseInsensitiveString)
    return s.equalsIgnoreCase(((CaseInsensitiveString) o).s);

    if (o instanceof String) // One-way interoperability!
        return s.equalsIgnoreCase((String) o);

    return false;
    } ... // Remainder omitted
}
```

The well-intentioned equals method in this class naively attempts to interoperate with ordinary strings. Let’s suppose that we have one caseinsensitive string and one ordinary one:

> 这个类中的 equals 方法天真地尝试与普通字符串进行互操作。假设我们有一个不区分大小写的字符串和一个普通字符串：

```java
CaseInsensitiveString cis = new CaseInsensitiveString("Polish");
String s = "polish";
```

As expected, cis.equals(s) returns true. The problem is that while the equals method in CaseInsensitiveString knows about ordinary strings, the equals method in String is oblivious to case-insensitive strings.Therefore, s.equals(cis) returns false, a clear violation of symmetry.Suppose you put a case-insensitive string into a collection:

> 正如预期的那样，`cis.equals(s)` 返回 true。问题是，虽然 CaseInsensitiveString 中的 equals 方法知道普通字符串，但是 String 中的 equals 方法对不区分大小写的字符串不知情。因此，`s.equals(cis)` 返回 false，这明显违反了对称性。假设你将不区分大小写的字符串放入集合中：

```java
List<CaseInsensitiveString> list = new ArrayList<>();
list.add(cis);
```

What does list.contains(s) return at this point? Who knows? In the current OpenJDK implementation, it happens to return false, but that’s just an implementation artifact. In another implementation, it could just as easily return true or throw a runtime exception. **Once you’ve violated the equals contract, you simply don’t know how other objects will behave when confronted with your object.**

> 此时 `list.contains(s)` 返回什么？谁知道呢？在当前的 OpenJDK 实现中，它碰巧返回 false，但这只是一个实现案例。在另一个实现中，它可以很容易地返回 true 或抛出运行时异常。一旦你违反了 equals 约定，就不知道当其他对象面对你的对象时，会如何表现。

**译注：contains 方法在 ArrayList 中的实现源码如下（省略了源码中的多行注释）：**

```java
// ArrayList 的大小
private int size;

// 保存 ArrayList 元素的容器，一个 Object 数组
transient Object[] elementData; // non-private to simplify nested class access

public boolean contains(Object o) {
    return indexOf(o) >= 0;
}

public int indexOf(Object o) {
    return indexOfRange(o, 0, size);
}

int indexOfRange(Object o, int start, int end) {
    Object[] es = elementData;
    if (o == null) {
        for (int i = start; i < end; i++) {
            if (es[i] == null) {
                return i;
            }
        }
    } else {
        for (int i = start; i < end; i++) {
            if (o.equals(es[i])) {
                return i;
            }
        }
    }
    return -1;
}
```

To eliminate the problem, merely remove the ill-conceived attempt to interoperate with String from the equals method. Once you do this, you can refactor the method into a single return statement:

> 为了消除这个问题，只需从 equals 方法中删除与 String 互操作的错误尝试。一旦你这样做了，你可以重构方法为一个单一的返回语句：

```java
@Override
public boolean equals(Object o) {
    return o instanceof CaseInsensitiveString && ((CaseInsensitiveString) o).s.equalsIgnoreCase(s);
}
```

**Transitivity** —The third requirement of the equals contract says that if one object is equal to a second and the second object is equal to a third, then the first object must be equal to the third. Again, it’s not hard to imagine violating this requirement unintentionally. Consider the case of a subclass that adds a new value component to its superclass. In other words, the subclass adds a piece of information that affects equals comparisons. Let’s start with a simple immutable two-dimensional integer point class:

> **传递性** ，equals 约定的第三个要求是，如果一个对象等于第二个对象，而第二个对象等于第三个对象，那么第一个对象必须等于第三个对象。同样，无意中违反了这个要求的情况不难想象。考虑向超类添加新的值组件时，子类的情况。换句话说，子类添加了一条影响 equals 比较的信息。让我们从一个简单的不可变二维整数点类开始：

```java
public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point))
            return false;
        Point p = (Point)o;
        return p.x == x && p.y == y;
    }
    ... // Remainder omitted
}
```

Suppose you want to extend this class, adding the notion of color to a point:

> 假设你想继承这个类，对一个点添加颜色的概念：

```java
public class ColorPoint extends Point {
    private final Color color;

    public ColorPoint(int x, int y, Color color) {
        super(x, y);
        this.color = color;
    }
    ... // Remainder omitted
}
```

How should the equals method look? If you leave it out entirely, the implementation is inherited from Point and color information is ignored in equals comparisons. While this does not violate the equals contract, it is clearly unacceptable. Suppose you write an equals method that returns true only if its argument is another color point with the same position and color:

> equals 方法应该是什么样子？如果你完全忽略它，则实现将从 Point 类继承而来，在 equals 比较中颜色信息将被忽略。虽然这并不违反 equals 约定，但显然是不可接受的。假设你写了一个 equals 方法，该方法只有当它的参数是另一个颜色点，且位置和颜色相同时才返回 true：

```java
// Broken - violates symmetry!
@Override
public boolean equals(Object o) {
    if (!(o instanceof ColorPoint))
        return false;
    return super.equals(o) && ((ColorPoint) o).color == color;
}
```

The problem with this method is that you might get different results when comparing a point to a color point and vice versa. The former comparison ignores color, while the latter comparison always returns false because the type of the argument is incorrect. To make this concrete, let’s create one point and one color point:

> 这种方法的问题是，当你比较一个点和一个颜色点时，你可能会得到不同的结果，反之亦然。前者比较忽略颜色，而后者比较总是返回 false，因为参数的类型是不正确的。为了使问题更具体，让我们创建一个点和一个颜色点：

```java
Point p = new Point(1, 2);
ColorPoint cp = new ColorPoint(1, 2, Color.RED);
```

Then p.equals(cp) returns true, while cp.equals(p) returns false. You might try to fix the problem by having ColorPoint.equals ignore color when doing “mixed comparisons”:

> 然后，`p.equals(cp)` 返回 true，而 `cp.equals(p)` 返回 false。当你做「混合比较」的时候，你可以通过让 `ColorPoint.equals` 忽略颜色来解决这个问题：

```java
// Broken - violates transitivity!
@Override
public boolean equals(Object o) {
    if (!(o instanceof Point))
        return false;

    // If o is a normal Point, do a color-blind comparison
    if (!(o instanceof ColorPoint))
        return o.equals(this);

    // o is a ColorPoint; do a full comparison
    return super.equals(o) && ((ColorPoint) o).color == color;
}
```

This approach does provide symmetry, but at the expense of transitivity:

> 这种方法确实提供了对称性，但牺牲了传递性：

```java
ColorPoint p1 = new ColorPoint(1, 2, Color.RED);
Point p2 = new Point(1, 2);
ColorPoint p3 = new ColorPoint(1, 2, Color.BLUE);
```

Now p1.equals(p2) and p2.equals(p3) return true, while p1.equals(p3) returns false, a clear violation of transitivity. The first two comparisons are “color-blind,” while the third takes color into account.

> 现在，`p1.equals(p2)` 和 `p2.equals(p3)` 返回 true，而 `p1.equals(p3)` 返回 false，这明显违反了传递性。前两个比较是「色盲」，而第三个比较考虑了颜色。

Also, this approach can cause infinite recursion: Suppose there are two subclasses of Point, say ColorPoint and SmellPoint, each with this sort of equals method. Then a call to myColorPoint.equals(mySmellPoint) will throw a StackOverflowError.

> 同样，这种方法会导致无限的递归：假设有两个点的子类，比如 ColorPoint 和 SmellPoint，每个都使用这种 equals 方法。然后调用 `myColorPoint.equals(mySmellPoint)` 会抛出 StackOverflowError。

So what’s the solution? It turns out that this is a fundamental problem of equivalence relations in object-oriented languages. **There is no way to extend an instantiable class and add a value component while preserving the equals contract,** unless you’re willing to forgo the benefits of object-oriented abstraction.

> 那么解决方案是什么？这是面向对象语言中等价关系的一个基本问题。**除非你愿意放弃面向对象的抽象优点，否则无法继承一个可实例化的类并添加一个值组件，同时保留 equals 约定。**

You may hear it said that you can extend an instantiable class and add a value component while preserving the equals contract by using a getClass test in place of the instanceof test in the equals method:

> 你可能会听到它说你可以继承一个实例化的类并添加一个值组件，同时通过在 equals 方法中使用 getClass 测试来代替 instanceof 测试来保持 equals 约定：

```java
// Broken - violates Liskov substitution principle (page 43)
@Override
public boolean equals(Object o) {

    if (o == null || o.getClass() != getClass())
        return false;

    Point p = (Point) o;
    return p.x == x && p.y == y;
}
```

This has the effect of equating objects only if they have the same implementation class. This may not seem so bad, but the consequences are unacceptable: An instance of a subclass of Point is still a Point, and it still needs to function as one, but it fails to do so if you take this approach! Let’s suppose we want to write a method to tell whether a point is on the unit circle. Here is one way we could do it:

> 只有当对象具有相同的实现类时，才会产生相等的效果。这可能看起来不是很糟糕，但其后果是不可接受的：Point 的子类的实例仍然是一个 Point，并且它仍然需要作为一个函数来工作，但是如果采用这种方法，它就不会这样做！假设我们要写一个方法来判断一个点是否在单位圆上。我们可以这样做：

```java
// Initialize unitCircle to contain all Points on the unit circle
private static final Set<Point> unitCircle = Set.of(
        new Point( 1, 0), new Point( 0, 1),
        new Point(-1, 0), new Point( 0, -1)
    );

    public static boolean onUnitCircle(Point p) {
        return unitCircle.contains(p);
}
```

While this may not be the fastest way to implement the functionality, it works fine. Suppose you extend Point in some trivial way that doesn’t add a value component, say, by having its constructor keep track of how many instances have been created:

> 虽然这可能不是实现功能的最快方法，但它工作得很好。假设你以一种不添加值组件的简单方式继承 Point，例如，让它的构造函数跟踪创建了多少实例：

```java
public class CounterPoint extends Point {
    private static final AtomicInteger counter = new AtomicInteger();

    public CounterPoint(int x, int y) {
        super(x, y);
        counter.incrementAndGet();
    }

    public static int numberCreated() {
        return counter.get();
    }
}
```

The Liskov substitution principle says that any important property of a type should also hold for all its subtypes so that any method written for the type should work equally well on its subtypes [Liskov87]. This is the formal statement of our earlier claim that a subclass of Point (such as CounterPoint) is still a Point and must act as one. But suppose we pass a CounterPoint to the onUnitCircle method. If the Point class uses a getClass-based equals method, the onUnitCircle method will return false regardless of the CounterPoint instance’s x and y coordinates. This is so because most collections, including the HashSet used by the onUnitCircle method, use the equals method to test for containment, and no CounterPoint instance is equal to any Point. If, however, you use a proper instanceof-based equals method on Point, the same onUnitCircle method works fine when presented with a CounterPoint instance.

> Liskov 替换原则指出，类型的任何重要属性都应该适用于所有子类型，因此为类型编写的任何方法都应该在其子类型上同样有效 [Liskov87]。这是我们先前做的正式声明，即点的子类（如 CounterPoint）仍然是一个 Point，并且必须作为一个 Point。但假设我们传递了一个 CounterPoint 给 onUnitCircle 方法。如果 Point 类使用基于 getclass 的 equals 方法，那么不管 CounterPoint 实例的 x 和 y 坐标如何，onUnitCircle 方法都会返回 false。这是因为大多数集合，包括 onUnitCircle 方法使用的 HashSet，都使用 equals 方法来测试包含性，没有一个 CounterPoint 实例等于任何一个点。但是，如果你在 Point 上使用了正确的基于实例的 equals 方法，那么在提供对位实例时，相同的 onUnitCircle 方法就可以很好地工作。

**译注：里氏替换原则（Liskov Substitution Principle，LSP）面向对象设计的基本原则之一。里氏替换原则指出：任何父类可以出现的地方，子类一定可以出现。LSP 是继承复用的基石，只有当衍生类可以替换掉父类，软件单位的功能不受到影响时，父类才能真正被复用，而衍生类也能够在父类的基础上增加新的行为。**

While there is no satisfactory way to extend an instantiable class and add a value component, there is a fine workaround: Follow the advice of Item 18,“Favor composition over inheritance.” Instead of having ColorPoint extend Point, give ColorPoint a private Point field and a public view method (Item 6) that returns the point at the same position as this color point:

> 虽然没有令人满意的方法来继承一个可实例化的类并添加一个值组件，但是有一个很好的解决方案：遵循 Item-18 的建议，「Favor composition over inheritance.」。给 ColorPoint 一个私有的 Point 字段和一个 public 视图方法（Item-6），而不是让 ColorPoint 继承 Point，该方法返回与这个颜色点相同位置的点：

```java
// Adds a value component without violating the equals contract
public class ColorPoint {
    private final Point point;
    private final Color color;

    public ColorPoint(int x, int y, Color color) {
        point = new Point(x, y);
        this.color = Objects.requireNonNull(color);
    }

    /**
    * Returns the point-view of this color point.
    */
    public Point asPoint() {
        return point;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof ColorPoint))
            return false;

        ColorPoint cp = (ColorPoint) o;
        return cp.point.equals(point) && cp.color.equals(color);
    }
    ... // Remainder omitted
}
```

There are some classes in the Java platform libraries that do extend an instantiable class and add a value component. For example,java.sql.Timestamp extends java.util.Date and adds a nanoseconds field. The equals implementation for Timestamp does violate symmetry and can cause erratic behavior if Timestamp and Date objects are used in the same collection or are otherwise intermixed. The Timestamp class has a disclaimer cautioning programmers against mixing dates and timestamps. While you won’t get into trouble as long as you keep them separate, there’s nothing to prevent you from mixing them, and the resulting errors can be hard to debug. This behavior of the Timestamp class was a mistake and should not be emulated.

> Java 库中有一些类确实继承了一个可实例化的类并添加了一个值组件。例如，`java.sql.Timestamp` 继承 `java.util.Date` 并添加了纳秒字段。如果在同一个集合中使用时间戳和日期对象，或者以其他方式混合使用时间戳和日期对象，那么时间戳的 equals 实现确实违反了对称性，并且可能导致不稳定的行为。Timestamp 类有一个免责声明，警告程序员不要混合使用日期和时间戳。虽然只要将它们分开，就不会遇到麻烦，但是没有什么可以阻止你将它们混合在一起，因此产生的错误可能很难调试。时间戳类的这种行为是错误的，不应该效仿。

Note that you can add a value component to a subclass of an abstract class without violating the equals contract. This is important for the sort of class hierarchies that you get by following the advice in Item 23, “Prefer class hierarchies to tagged classes.” For example, you could have an abstract class Shape with no value components, a subclass Circle that adds a radius field, and a subclass Rectangle that adds length and width fields.Problems of the sort shown earlier won’t occur so long as it is impossible to create a superclass instance directly.

> 注意，你可以向抽象类的子类添加一个值组件，而不违反 equals 约定。这对于遵循 Item-23 中的建议而得到的类层次结构很重要，「Prefer class hierarchies to tagged classes.」。例如，可以有一个没有值组件的抽象类形状、一个添加半径字段的子类圆和一个添加长度和宽度字段的子类矩形。只要不可能直接创建超类实例，前面显示的那种问题就不会发生。

**Consistency—** The fourth requirement of the equals contract says that if two objects are equal, they must remain equal for all time unless one (or both) of them is modified. In other words, mutable objects can be equal to different objects at different times while immutable objects can’t. When you write a class,think hard about whether it should be immutable (Item 17). If you conclude that it should, make sure that your equals method enforces the restriction that equal objects remain equal and unequal objects remain unequal for all time.

> **一致性** ，对等约定的第四个要求是，如果两个对象相等，它们必须一直保持相等，除非其中一个（或两个）被修改。换句话说，可变对象可以等于不同时间的不同对象，而不可变对象不能。在编写类时，仔细考虑它是否应该是不可变的（Item-17）。如果你认为应该这样做，那么请确保你的 equals 方法执行了这样的限制，即相等的对象始终是相等的，而不等的对象始终是不等的。

Whether or not a class is immutable, **do not write an equals method that depends on unreliable resources.** It’s extremely difficult to satisfy the consistency requirement if you violate this prohibition. For example,java.net.URL’s equals method relies on comparison of the IP addresses of the hosts associated with the URLs. Translating a host name to an IP address can require network access, and it isn’t guaranteed to yield the same results over time. This can cause the URL equals method to violate the equals contract and has caused problems in practice. The behavior of URL’s equals method was a big mistake and should not be emulated. Unfortunately, it cannot be changed due to compatibility requirements. To avoid this sort of problem,equals methods should perform only deterministic computations on memoryresident objects.

> 无论一个类是否不可变，都不要编写依赖于不可靠资源的 equals 方法。如果你违反了这个禁令，就很难满足一致性要求。例如，`java.net.URL` 的 equals 方法依赖于与 url 相关联的主机的 IP 地址的比较。将主机名转换为 IP 地址可能需要网络访问，而且不能保证随着时间的推移产生相同的结果。这可能会导致 URL 的 equals 方法违反约定，并在实践中造成问题。URL 的 equals 方法的行为是一个很大的错误，不应该被模仿。不幸的是，由于兼容性需求，它不能更改。为了避免这种问题，equals 方法应该只对 memoryresident 对象执行确定性计算。

**Non-nullity—** The final requirement lacks an official name, so I have taken the liberty of calling it “non-nullity.” It says that all objects must be unequal to null. While it is hard to imagine accidentally returning true in response to the invocation o.equals(null), it isn’t hard to imagine accidentally throwing a NullPointerException. The general contract prohibits this.Many classes have equals methods that guard against it with an explicit test for null:

> **非无效性** ，最后的要求没有一个正式的名称，所以我冒昧地称之为「非无效性」。它说所有对象都不等于 null。虽然很难想象在响应调用 `o.equals(null)` 时意外地返回 true，但不难想象意外地抛出 NullPointerException。一般约定中禁止这样做。许多类都有相等的方法，通过显式的 null 测试来防止它：

```java
@Override
public boolean equals(Object o) {
    if (o == null)
        return false;
    ...
}
```

This test is unnecessary. To test its argument for equality, the equals method must first cast its argument to an appropriate type so its accessors can be invoked or its fields accessed. Before doing the cast, the method must use the instanceof operator to check that its argument is of the correct type:

> 这个测试是不必要的。要测试其参数是否相等，equals 方法必须首先将其参数转换为适当的类型，以便能够调用其访问器或访问其字段。在执行转换之前，方法必须使用 instanceof 运算符来检查其参数的类型是否正确：

```java
@Override
public boolean equals(Object o) {
    if (!(o instanceof MyType))
        return false;
    MyType mt = (MyType) o;
    ...
}
```

If this type check were missing and the equals method were passed an argument of the wrong type, the equals method would throw a ClassCastException, which violates the equals contract. But the instanceof operator is specified to return false if its first operand is null,regardless of what type appears in the second operand [JLS, 15.20.2]. Therefore,the type check will return false if null is passed in, so you don’t need an explicit null check.

> 如果缺少这个类型检查，并且 equals 方法传递了一个错误类型的参数，equals 方法将抛出 ClassCastException，这违反了 equals 约定。但是，如果 instanceof 操作符的第一个操作数为空，则指定该操作符返回 false，而不管第二个操作数 [JLS, 15.20.2] 中出现的是什么类型。因此，如果传入 null，类型检查将返回 false，因此不需要显式的 null 检查。

Putting it all together, here’s a recipe for a high-quality equals method:

> 综上所述，这里有一个高质量构建 equals 方法的秘诀：

1、**Use the == operator to check if the argument is a reference to this object.** If so, return true. This is just a performance optimization but one that is worth doing if the comparison is potentially expensive.

> **使用 == 运算符检查参数是否是对该对象的引用。** 如果是，返回 true。这只是一种性能优化，但如果比较的代价可能很高，那么这种优化是值得的。

2、**Use the instanceof operator to check if the argument has the correct type.** If not, return false. Typically, the correct type is the class in which the method occurs. Occasionally, it is some interface implemented by this class. Use an interface if the class implements an interface that refines the equals contract to permit comparisons across classes that implement the interface. Collection interfaces such as Set, List, Map, and Map.Entry have this property.

> **使用 instanceof 运算符检查参数是否具有正确的类型。** 如果不是，返回 false。通常，正确的类型是方法发生的类。有时候，它是由这个类实现的某个接口。如果类实现了一个接口，该接口对 equals 约定进行了改进，以允许跨实现该接口的类进行比较，则使用该接口。集合接口，如 Set、List、Map 和 Map.Entry 具有此属性。

3、**Cast the argument to the correct type.** Because this cast was preceded by an instanceof test, it is guaranteed to succeed.

> **将参数转换为正确的类型。** 因为在这个强制类型转换之前有一个实例测试，所以它肯定会成功。

4、**For each “significant” field in the class, check if that field of the argument matches the corresponding field of this object.** If all these tests succeed, return true; otherwise, return false. If the type in Step 2 is an interface, you must access the argument’s fields via interface methods; if the type is a class, you may be able to access the fields directly, depending on their accessibility.

> **对于类中的每个「重要」字段，检查参数的字段是否与该对象的相应字段匹配。** 如果所有这些测试都成功，返回 true；否则返回 false。如果第 2 步中的类型是接口，则必须通过接口方法访问参数的字段；如果是类，你可以根据字段的可访问性直接访问它们。

For primitive fields whose type is not float or double, use the == operator for comparisons; for object reference fields, call the equals method recursively; for float fields, use the static Float.compare(float,float) method; and for double fields, use Double.compare(double, double). The special treatment of float and double fields is made necessary by the existence of Float.NaN, -0.0f and the analogous double values; see JLS 15.21.1 or the documentation of Float.equals for details. While you could compare float and double fields with the static methods Float.equals and Double.equals, this would entail autoboxing on every comparison, which would have poor performance. For array fields, apply these guidelines to each element. If every element in an array field is significant, use one of the Arrays.equals methods.

> 对于类型不是 float 或 double 的基本类型字段，使用 == 运算符进行比较；对于对象引用字段，递归调用 equals 方法；对于 float 字段，使用 `static Float.compare(float,float)` 方法；对于 double 字段，使用 `Double.compare(double, double)`。float 和 double 字段的特殊处理是由于 `Float.NaN`、-0.0f 和类似的双重值的存在而必须的；请参阅 JLS 15.21.1 或 `Float.equals` 文档。虽然你可以将 float 和 double 字段与静态方法 Float.equals 和 Double.equals 进行比较，这将需要在每个比较上进行自动装箱，这将有较差的性能。对于数组字段，将这些指导原则应用于每个元素。如果数组字段中的每个元素都很重要，那么使用 `Arrays.equals` 方法之一。

Some object reference fields may legitimately contain null. To avoid the possibility of a NullPointerException, check such fields for equality using the static method Objects.equals(Object, Object).

> 一些对象引用字段可能合法地包含 null。为了避免可能出现 NullPointerException，请使用静态方法 `Objects.equals(Object, Object)` 检查这些字段是否相等。

For some classes, such as CaseInsensitiveString above, field comparisons are more complex than simple equality tests. If this is the case,you may want to store a canonical form of the field so the equals method can do a cheap exact comparison on canonical forms rather than a more costly nonstandard comparison. This technique is most appropriate for immutable classes (Item 17); if the object can change, you must keep the canonical form up to date.

> 对于某些类，例如上面的 CaseInsensitiveString，字段比较比简单的 equal 测试更复杂。如果是这样，你可能希望存储字段的规范形式，以便 equals 方法可以对规范形式进行廉价的精确比较，而不是更昂贵的非标准比较。这种技术最适合于不可变类（Item-17）；如果对象可以更改，则必须使规范形式保持最新。

The performance of the equals method may be affected by the order in which fields are compared. For best performance, you should first compare fields that are more likely to differ, less expensive to compare, or, ideally,both. You must not compare fields that are not part of an object’s logical state,such as lock fields used to synchronize operations. You need not compare derived fields, which can be calculated from “significant fields,” but doing so may improve the performance of the equals method. If a derived field amounts to a summary description of the entire object, comparing this field will save you the expense of comparing the actual data if the comparison fails.For example, suppose you have a Polygon class, and you cache the area. If two polygons have unequal areas, you needn’t bother comparing their edges and vertices.

> equals 方法的性能可能会受到字段比较顺序的影响。为了获得最佳性能，你应该首先比较那些更可能不同、比较成本更低的字段，或者理想情况下两者都比较。不能比较不属于对象逻辑状态的字段，例如用于同步操作的锁字段。你不需要比较派生字段（可以从「重要字段」计算），但是这样做可能会提高 equals 方法的性能。如果派生字段相当于整个对象的摘要描述，那么如果比较失败，比较该字段将节省比较实际数据的开销。例如，假设你有一个多边形类，你缓存这个区域。如果两个多边形的面积不相等，你不需要比较它们的边和顶点。

**When you are finished writing your equals method, ask yourself three questions: Is it symmetric? Is it transitive? Is it consistent?** And don’t just ask yourself; write unit tests to check, unless you used AutoValue (page 49) to generate your equals method, in which case you can safely omit the tests. If the properties fail to hold, figure out why, and modify the equals method accordingly. Of course your equals method must also satisfy the other two properties (reflexivity and non-nullity), but these two usually take care of themselves.

> **写完 equals 方法后，问自己三个问题：它具备对称性吗？具备传递性吗？具备一致性吗？** 不要只问自己，要编写单元测试来检查，除非使用 AutoValue（第 49 页）来生成 equals 方法，在这种情况下，你可以安全地省略测试。如果属性不能保持，请找出原因，并相应地修改 equals 方法。当然，equals 方法还必须满足其他两个属性（反身性和非无效性），但这两个通常会自己处理。

An equals method constructed according to the previous recipe（n.食谱，配方） is shown in this simplistic PhoneNumber class:

> 在这个简单的 PhoneNumber 类中，根据前面的方法构造了一个 equals 方法：

```java
// Class with a typical equals method
public final class PhoneNumber {
    private final short areaCode, prefix, lineNum;

    public PhoneNumber(int areaCode, int prefix, int lineNum) {
        this.areaCode = rangeCheck(areaCode, 999, "area code");
        this.prefix = rangeCheck(prefix, 999, "prefix");
        this.lineNum = rangeCheck(lineNum, 9999, "line num");
    }

    private static short rangeCheck(int val, int max, String arg) {
        if (val < 0 || val > max)
            throw new IllegalArgumentException(arg + ": " + val);
        return (short) val;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof PhoneNumber))
            return false;

        PhoneNumber pn = (PhoneNumber)o;
        return pn.lineNum == lineNum && pn.prefix == prefix && pn.areaCode == areaCode;
    } ... // Remainder omitted
}
```

Here are a few final caveats:

> 以下是一些最后的警告：

- **Always override hashCode when you override equals (Item 11).**

> **当你覆盖 equals 时，也覆盖 hashCode。**（Item-11）

- **Don’t try to be too clever.** If you simply test fields for equality, it’s not hard to adhere to the equals contract. If you are overly aggressive in searching for equivalence, it’s easy to get into trouble. It is generally a bad idea to take any form of aliasing into account. For example, the File class shouldn’t attempt to equate symbolic links referring to the same file. Thankfully, it doesn’t.

> **不要自作聪明。** 如果你只是为了判断相等性而测试字段，那么遵循 equals 约定并不困难。如果你在寻求对等方面过于激进，很容易陷入麻烦。一般来说，考虑到任何形式的混叠都不是一个好主意。例如，File 类不应该尝试将引用同一文件的符号链接等同起来。值得庆幸的是，它不是。

- **Don’t substitute another type for Object in the equals declaration.** It is not uncommon for a programmer to write an equals method that looks like this and then spend hours puzzling over why it doesn’t work properly:

> **不要用另一种类型替换 equals 声明中的对象。** 对于程序员来说，编写一个类似于这样的 equals 方法，然后花上几个小时思考为什么它不能正常工作是很常见的：

```java
// Broken - parameter type must be Object!
public boolean equals(MyClass o) {
    ...
}
```

The problem is that this method does not override Object.equals,whose argument is of type Object, but overloads it instead (Item 52). It is unacceptable to provide such a “strongly typed” equals method even in addition to the normal one, because it can cause Override annotations in subclasses to generate false positives and provide a false sense of security.

> 这里的问题是，这个方法没有覆盖其参数类型为 Object 的 Object.equals，而是重载了它（Item-52）。即使是普通的方法，提供这样一个「强类型的」equals 方法是不可接受的，因为它会导致子类中的重写注释产生误报并提供错误的安全性。

Consistent use of the Override annotation, as illustrated throughout this item, will prevent you from making this mistake (Item 40). This equals method won’t compile, and the error message will tell you exactly what is wrong:

> 如本条目所示，一致使用 Override 注释将防止你犯此错误（Item-40）。这个 equals 方法不会编译，错误消息会告诉你什么是错误的：

```java
// Still broken, but won’t compile
@Override
public boolean equals(MyClass o) {
    ...
}
```

Writing and testing equals (and hashCode) methods is tedious, and the resulting code is mundane. An excellent alternative to writing and testing these methods manually is to use Google’s open source AutoValue framework, which automatically generates these methods for you, triggered by a single annotation on the class . In most cases, the methods generated by AutoValue are essentially identical to those you’d write yourself.

> 编写和测试 equals （和 hashCode）方法很乏味，生成的代码也很单调。手动编写和测试这些方法的一个很好的替代方法是使用谷歌的开源 AutoValue 框架，它会自动为你生成这些方法，由类上的一个注释触发。在大多数情况下，AutoValue 生成的方法与你自己编写的方法基本相同。

IDEs, too, have facilities to generate equals and hashCode methods, but the resulting source code is more verbose and less readable than code that uses AutoValue, does not track changes in the class automatically, and therefore requires testing. That said, having IDEs generate equals (and hashCode)methods is generally preferable to implementing them manually because IDEs do not make careless mistakes, and humans do.

> IDE 也有生成 equals 和 hashCode 方法的功能，但是生成的源代码比使用 AutoValue 的代码更冗长，可读性更差，不会自动跟踪类中的变化，因此需要进行测试。也就是说，让 IDE 生成 equals（和 hashCode）方法通常比手动实现更可取，因为 IDE 不会出现粗心的错误，而人会。

In summary, don’t override the equals method unless you have to: in many cases, the implementation inherited from Object does exactly what you want.If you do override equals, make sure to compare all of the class’s significant fields and to compare them in a manner that preserves all five provisions of the equals contract.

> 总之，除非必须，否则不要覆盖 equals 方法：在许多情况下，从 Object 继承而来的实现正是你想要的。如果你确实覆盖了 equals，那么一定要比较类的所有重要字段，并以保留 equals 约定的所有 5 项规定的方式进行比较。

---

## 【11】当覆盖 equals 时，始终覆盖 hashCode

> Always override hashCode when you override equals

**You must override hashCode in every class that overrides equals.** If you fail to do so, your class will violate（vt.违反） the general contract for hashCode, which will prevent it from functioning properly（adv.适当地，正确地） in collections such as HashMap and HashSet. Here is the contract, adapted from the Object specification :

> **在覆盖 equals 的类中，必须覆盖 hashCode。** 如果你没有这样做，你的类将违反 hashCode 的一般约定，这将阻止该类在 HashMap 和 HashSet 等集合中正常运行。以下是根据目标规范修改的约定：

- When the hashCode method is invoked on an object repeatedly during an execution of an application, it must consistently（adv.一贯地，一致地） return the same value, provided no information used in equals comparisons is modified. This value need not remain consistent from one execution of an application to another.

> 当在应用程序执行期间对对象重复调用 hashCode 方法时，它必须一致地返回相同的值，前提是不对 equals 比较中使用的信息进行修改。这个值不需要在应用程序的不同执行之间保持一致。

- If two objects are equal according to the equals(Object) method, then calling hashCode on the two objects must produce the same integer result.

> 如果根据 `equals(Object)` 方法判断出两个对象是相等的，那么在两个对象上调用 hashCode 必须产生相同的整数结果。

- If two objects are unequal according to the equals(Object) method, it is not required that calling hashCode on each of the objects must produce distinct results. However, the programmer should be aware that producing distinct results for unequal objects may improve the performance of hash tables.

> 如果根据 `equals(Object)` 方法判断出两个对象不相等，则不需要在每个对象上调用 hashCode 时必须产生不同的结果。但是，程序员应该知道，为不相等的对象生成不同的结果可能会提高 hash 表的性能。

**The key provision（n.规定，条款） that is violated when you fail to override hashCode is the second one: equal objects must have equal hash codes.** Two distinct instances may be logically equal according to a class’s equals method, but to Object’s hashCode method, they’re just two objects with nothing much in common. Therefore, Object’s hashCode method returns two seemingly random numbers instead of two equal numbers as required by the contract.For example, suppose you attempt to use instances of the PhoneNumber class from Item 10 as keys in a HashMap:

> **当你无法覆盖 hashCode 时，违反的关键条款是第二个：相等的对象必须具有相等的 hash 代码。** 根据类的 equals 方法，两个不同的实例在逻辑上可能是相等的，但是对于对象的 hashCode 方法来说，它们只是两个没有什么共同之处的对象。因此，Object 的 hashCode 方法返回两个看似随机的数字，而不是约定要求的两个相等的数字。例如，假设你尝试使用 Item-10 中的 PhoneNumber 类实例作为 HashMap 中的键：

```java
Map<PhoneNumber, String> m = new HashMap<>();
m.put(new PhoneNumber(707, 867, 5309), "Jenny");
```

At this point（这时，此时此刻）, you might expect m.get(new PhoneNumber(707, 867,5309)) to return "Jenny", but instead, it returns null. Notice that two PhoneNumber instances are involved: one is used for insertion into the HashMap, and a second, equal instance is used for (attempted) retrieval（n.检索）. The PhoneNumber class’s failure to override hashCode causes the two equal instances to have unequal hash codes, in violation（n.违反） of the hashCode contract.Therefore, the get method is likely to look for the phone number in a different hash bucket from the one in which it was stored by the put method. Even if the two instances happen to hash to the same bucket, the get method will almost certainly return null, because HashMap has an optimization that caches the hash code associated with each entry and doesn’t bother checking for object equality if the hash codes don’t match.

> 此时，你可能期望 `m.get(new PhoneNumber(707, 867,5309))` 返回「Jenny」，但是它返回 null。注意，这里涉及到两个 PhoneNumber 实例：一个用于插入到 HashMap 中，另一个 equal 实例用于尝试检索。PhoneNumber 类未能覆盖 hashCode，导致两个相等的实例具有不相等的 hash 代码，这违反了 hashCode 约定。因此，get 方法查找电话号码的 hash 桶可能会在与 put 方法存储电话号码的 hash 桶不同。即使这两个实例碰巧 hash 到同一个 hash 桶上，get 方法几乎肯定会返回 null，因为 HashMap 有一个优化，它缓存与每个条目相关联的 hash 代码，如果 hash 代码不匹配，就不会检查对象是否相等。

Fixing this problem is as simple as writing a proper hashCode method for PhoneNumber. So what should a hashCode method look like? It’s trivial to write a bad one. This one, for example, is always legal but should never be used:

> 解决这个问题就像为 PhoneNumber 编写一个正确的 hashCode 方法一样简单。那么 hashCode 方法应该是什么样的呢？写一个不好的很简单。举个例子，这个方法总是合法的，但是不应该被使用：

```java
// The worst possible legal hashCode implementation - never use!
@Override
public int hashCode() { return 42; }
```

It’s legal（adj.合法的） because it ensures that equal objects have the same hash code. It’s atrocious because it ensures that every object has the same hash code. Therefore,every object hashes to the same bucket, and hash tables degenerate to linked lists. Programs that should run in linear time instead run in quadratic time. For large hash tables, this is the difference between working and not working.

> 它是合法的，因为它确保了相等的对象具有相同的 hash 代码。同时它也很糟糕，因为它使每个对象都有相同的 hash 代码。因此，每个对象都 hash 到同一个桶中， hash 表退化为链表。应以线性时间替代运行的程序。对于大型 hash 表，这是工作和不工作的区别。

A good hash function tends to produce unequal hash codes for unequal instances. This is exactly what is meant by the third part of the hashCode contract. Ideally, a hash function should distribute（vt.分配） any reasonable collection of unequal instances uniformly across all int values. Achieving this ideal can be difficult. Luckily it’s not too hard to achieve a fair approximation（n.接近）. Here is a simple recipe:

> 一个好的 hash 函数倾向于为不相等的实例生成不相等的 hash 代码。这正是 hashCode 约定的第三部分的含义。理想情况下， hash 函数应该在所有 int 值之间均匀分布所有不相等实例的合理集合。实现这个理想是很困难的。幸运的是，实现一个类似的并不太难。这里有一个简单的方式：

1、Declare an int variable named result, and initialize it to the hash code c for the first significant field in your object, as computed in step 2.a. (Recall from Item 10 that a significant field is a field that affects equals comparisons.)

> 声明一个名为 result 的 int 变量，并将其初始化为对象中第一个重要字段的 hash 代码 c，如步骤 2.a 中计算的那样。（回想一下 Item-10 中的重要字段是影响相等比较的字段。）

2、For every remaining significant field f in your object, do the following:

> 对象中剩余的重要字段 f，执行以下操作：

a. Compute an int hash code c for the field:

> 为字段计算一个整数 hash 码 c：

i. If the field is of a primitive type, compute Type.hashCode(f),where Type is the boxed primitive class corresponding to f’s type.

> 如果字段是基本数据类型，计算 `Type.hashCode(f)`，其中 type 是与 f 类型对应的包装类。

ii. If the field is an object reference and this class’s equals method compares the field by recursively（adv.递归地） invoking equals, recursively invoke hashCode on the field. If a more complex comparison is required,compute a “canonical representation” for this field and invoke hashCode on the canonical representation. If the value of the field is null, use 0 (or some other constant, but 0 is traditional).

> 如果字段是对象引用，并且该类的 equals 方法通过递归调用 equals 来比较字段，则递归调用字段上的 hashCode。如果需要更复杂的比较，则为该字段计算一个「规范表示」，并在规范表示上调用 hashCode。如果字段的值为空，则使用 0（或其他常数，但 0 是惯用的）。

iii. If the field is an array, treat it as if each significant element were a separate field. That is, compute a hash code for each significant element by applying these rules recursively, and combine the values per step 2.b. If the array has no significant elements, use a constant, preferably not 0. If all elements are significant, use Arrays.hashCode.

> 如果字段是一个数组，则将其视为每个重要元素都是一个单独的字段。也就是说，通过递归地应用这些规则计算每个重要元素的 hash 代码，并将每个步骤 2.b 的值组合起来。如果数组中没有重要元素，则使用常量，最好不是 0。如果所有元素都很重要，那么使用 `Arrays.hashCode`。

b. Combine the hash code c computed in step 2.a into result as follows:

> 将步骤 2.a 中计算的 hash 代码 c 合并到结果，如下所示：

```java
result = 31 * result + c;
```

3、Return result.

> 返回 result。

When you are finished writing the hashCode method, ask yourself whether equal instances have equal hash codes. Write unit tests to verify your intuition (unless you used AutoValue to generate your equals and hashCode methods,in which case you can safely omit these tests). If equal instances have unequal hash codes, figure out why and fix the problem.

> 当你完成了 hashCode 方法的编写之后，问问自己相同的实例是否具有相同的 hash 代码。编写单元测试来验证你的直觉（除非你使用 AutoValue 生成你的 equals 和 hashCode 方法，在这种情况下你可以安全地省略这些测试）。如果相同的实例有不相等的 hash 码，找出原因并修复问题。

You may exclude（vt.排除） derived（adj.派生的） fields from the hash code computation. In other words, you may ignore any field whose value can be computed from fields included in the computation. You must exclude any fields that are not used in equals comparisons, or you risk violating the second provision of the hashCode contract.

> 可以从 hash 代码计算中排除派生字段。换句话说，你可以忽略任何可以从计算中包含的字段计算其值的字段。你必须排除不用于对等比较的任何字段，否则你可能会违反 hashCode 约定的第二个条款。

The multiplication in step 2.b makes the result depend on the order of the fields, yielding a much better hash function if the class has multiple similar fields. For example, if the multiplication were omitted from a String hash function, all anagrams would have identical hash codes. The value 31 was chosen because it is an odd prime. If it were even and the multiplication overflowed, information would be lost, because multiplication by 2 is equivalent to shifting. The advantage of using a prime is less clear, but it is traditional. A nice property of 31 is that the multiplication can be replaced by a shift and a subtraction for better performance on some architectures: 31 \* i == (i <<5) - i. Modern VMs do this sort of optimization automatically.

> 第二步的乘法。b 使结果取决于字段的顺序，如果类有多个相似的字段，则产生一个更好的 hash 函数。例如，如果字符串 hash 函数中省略了乘法，那么所有的字谜都有相同的 hash 码。选择 31 是因为它是奇素数。如果是偶数，乘法运算就会溢出，信息就会丢失，因为乘法运算等于移位。使用素数的好处不太明显，但它是传统的。31 的一个很好的特性是，可以用移位和减法来代替乘法，从而在某些体系结构上获得更好的性能：`31 * i == (i <<5) – i`。现代虚拟机自动进行这种优化。

Let’s apply the previous recipe to the PhoneNumber class:

> 让我们将前面的方法应用到 PhoneNumber 类：

```java
// Typical hashCode method
@Override
public int hashCode() {
    int result = Short.hashCode(areaCode);
    result = 31 * result + Short.hashCode(prefix);
    result = 31 * result + Short.hashCode(lineNum);
    return result;
}
```

Because this method returns the result of a simple deterministic（adj.确定性的） computation whose only inputs are the three significant fields in a PhoneNumber instance,it is clear that equal PhoneNumber instances have equal hash codes. This method is, in fact, a perfectly good hashCode implementation for PhoneNumber, on par with those in the Java platform libraries. It is simple, is reasonably fast, and does a reasonable job of dispersing unequal phone numbers into different hash buckets.

> 因为这个方法返回一个简单的确定性计算的结果，它的唯一输入是 PhoneNumber 实例中的三个重要字段，所以很明显，相等的 PhoneNumber 实例具有相等的 hash 码。实际上，这个方法是 PhoneNumber 的一个非常好的 hashCode 实现，与 Java 库中的 hashCode 实现相当。它很简单，速度也相当快，并且合理地将不相等的电话号码分散到不同的 hash 桶中。

While the recipe in this item yields reasonably good hash functions, they are not state-of-the-art. They are comparable in quality to the hash functions found in the Java platform libraries’ value types and are adequate for most uses. If you have a bona fide need for hash functions less likely to produce collisions, see Guava’s com.google.common.hash.Hashing [Guava].

> 虽然本条目中的方法产生了相当不错的 hash 函数，但它们并不是最先进的。它们的质量可与 Java 库的值类型中的 hash 函数相媲美，对于大多数用途来说都是足够的。如果你确实需要不太可能产生冲突的 hash 函数，请参阅 Guava 的 com.google.common.hash.Hashing [Guava]。

The Objects class has a static method that takes an arbitrary number of objects and returns a hash code for them. This method, named hash, lets you write one-line hashCode methods whose quality is comparable to those written according to the recipe in this item. Unfortunately, they run more slowly because they entail array creation to pass a variable number of arguments, as well as boxing and unboxing if any of the arguments are of primitive type. This style of hash function is recommended for use only in situations where performance is not critical. Here is a hash function for PhoneNumber written using this technique:

> 对象类有一个静态方法，它接受任意数量的对象并返回它们的 hash 代码。这个名为 hash 的方法允许你编写一行 hash 代码方法，这些方法的质量可以与根据本项中的菜谱编写的方法媲美。不幸的是，它们运行得更慢，因为它们需要创建数组来传递可变数量的参数，如果任何参数是原始类型的，则需要进行装箱和拆箱。推荐只在性能不重要的情况下使用这种 hash 函数。下面是使用这种技术编写的 PhoneNumber 的 hash 函数：

```java
// One-line hashCode method - mediocre performance
@Override
public int hashCode() {
    return Objects.hash(lineNum, prefix, areaCode);
}
```

If a class is immutable and the cost of computing the hash code is significant,you might consider caching the hash code in the object rather than recalculating it each time it is requested. If you believe that most objects of this type will be used as hash keys, then you should calculate the hash code when the instance is created. Otherwise, you might choose to lazily initialize the hash code the first time hash-Code is invoked. Some care is required to ensure that the class remains thread-safe in the presence of a lazily initialized field (Item 83). Our PhoneNumber class does not merit this treatment, but just to show you how it’s done, here it is. Note that the initial value for the hashCode field (in this case, 0) should not be the hash code of a commonly created instance:

> 如果一个类是不可变的，并且计算 hash 代码的成本非常高，那么你可以考虑在对象中缓存 hash 代码，而不是在每次请求时重新计算它。如果你认为这种类型的大多数对象都将用作 hash 键，那么你应该在创建实例时计算 hash 代码。否则，你可能选择在第一次调用 hash 代码时延迟初始化 hash 代码。在一个延迟初始化的字段（Item-83）的情况下，需要一些注意来确保该类仍然是线程安全的。我们的 PhoneNumber 类不值得进行这种处理，但只是为了向你展示它是如何实现的，在这里。注意，hashCode 字段的初始值（在本例中为 0）不应该是通常创建的实例的 hash 代码：

```java
// hashCode method with lazily initialized cached hash code
private int hashCode; // Automatically initialized to 0
@Override
public int hashCode() {
    int result = hashCode;

    if (result == 0) {
        result = Short.hashCode(areaCode);
        result = 31 * result + Short.hashCode(prefix);
        result = 31 * result + Short.hashCode(lineNum);
        hashCode = result;
    }

    return result;
}
```

**Do not be tempted to exclude significant fields from the hash code computation to improve performance.** While the resulting hash function may run faster, its poor quality may degrade hash tables’ performance to the point where they become unusable. In particular, the hash function may be confronted with a large collection of instances that differ mainly in regions you’ve chosen to ignore. If this happens, the hash function will map all these instances to a few hash codes, and programs that should run in linear time will instead run in quadratic time.

> **不要试图从 hash 代码计算中排除重要字段，以提高性能。** 虽然得到的 hash 函数可能运行得更快，但其糟糕的质量可能会将 hash 表的性能降低到无法使用的程度。特别是， hash 函数可能会遇到大量实例，这些实例主要在你选择忽略的区域不同。如果发生这种情况， hash 函数将把所有这些实例映射到一些 hash 代码，应该在线性时间内运行的程序将在二次时间内运行。

This is not just a theoretical problem. Prior to Java 2, the String hash function used at most sixteen characters evenly（adv.均匀地） spaced throughout the string,starting with the first character. For large collections of hierarchical names, such as URLs, this function displayed exactly the pathological（adj.病态的） behavior described earlier.

> 这不仅仅是一个理论问题。在 Java 2 之前，字符串 hash 函数在字符串中，以第一个字符开始，最多使用 16 个字符。对于大量的分级名称集合（如 url），该函数完全显示了前面描述的病态行为。

**Don’t provide a detailed specification for the value returned by hashCode, so clients can’t reasonably depend on it; this gives you the flexibility to change it.** Many classes in the Java libraries, such as String and Integer, specify（vt.指定，详细说明） the exact value returned by their hashCode method as a function of the instance value. This is not a good idea but a mistake that we’re forced to live with: It impedes the ability to improve the hash function in future releases. If you leave the details unspecified and a flaw is found in the hash function or a better hash function is discovered, you can change it in a subsequent release.

> **不要为 hashCode 返回的值提供详细的规范，这样客户端就不能合理地依赖它。这（也）给了你更改它的灵活性。** Java 库中的许多类，例如 String 和 Integer，都将 hashCode 方法返回的确切值指定为实例值的函数。这不是一个好主意，而是一个我们不得不面对的错误：它阻碍了在未来版本中改进 hash 函数的能力。如果你保留了未指定的细节，并且在 hash 函数中发现了缺陷，或者发现了更好的 hash 函数，那么你可以在后续版本中更改它。

In summary, you must override hashCode every time you override equals,or your program will not run correctly. Your hashCode method must obey the general contract specified in Object and must do a reasonable job assigning unequal hash codes to unequal instances. This is easy to achieve, if slightly tedious, using the recipe on page 51. As mentioned in Item 10, the AutoValue framework provides a fine alternative to writing equals and hashCode methods manually, and IDEs also provide some of this functionality.

> 总之，每次覆盖 equals 时都必须覆盖 hashCode，否则程序将无法正确运行。你的 hashCode 方法必须遵守 Object 中指定的通用约定，并且必须合理地将不相等的 hash 代码分配给不相等的实例。这很容易实现，如果有点乏味，可使用第 51 页的方法。如 Item-10 所述，AutoValue 框架提供了一种很好的替代手动编写 equals 和 hashCode 的方法，IDE 也提供了这种功能。

---

## 【12】始终覆盖 toString 方法

> Always override toString

While Object provides an implementation of the toString method, the string that it returns is generally not what the user of your class wants to see. It consists of（由…组成） the class name followed by an “at” sign (@) and the unsigned hexadecimal representation of the hash code, for example,PhoneNumber@163b91. The general contract for toString says that the returned string should be “a concise but informative representation that is easy for a person to read.” While it could be argued that PhoneNumber@163b91 is concise and easy to read, it isn’t very informative when compared to 707-867-5309. The toString contract goes on to say, “It is recommended that all subclasses override this method.” Good advice, indeed!

> 虽然 Object 提供 toString 方法的实现，但它返回的字符串通常不是类的用户希望看到的。它由后跟「at」符号（@）的类名和 hash 代码的无符号十六进制表示（例如 PhoneNumber@163b91）组成。toString 的通用约定是这么描述的，返回的字符串应该是「简洁但信息丰富的表示，易于阅读」。虽然有人认为 PhoneNumber@163b91 简洁易懂，但与 707-867-5309 相比，它的信息量并不大。toString 约定接着描述，「建议所有子类覆盖此方法。」好建议，确实！

While it isn’t as critical（adj.至关重要的） as obeying the equals and hashCode contracts (Items 10 and 11), **providing a good toString implementation makes your class much more pleasant to use and makes systems using the class easier to debug.** The toString method is automatically invoked when an object is passed to println, printf, the string concatenation（n.连结） operator, or assert, or is printed by a debugger. Even if you never call toString on an object, others may. For example, a component that has a reference to your object may include the string representation of the object in a logged error message. If you fail to override toString, the message may be all but useless.

> 虽然它不如遵守 equals 和 hashCode 约定（Item-10 和 Item-11）那么重要，但是 **提供一个好的 toString 实现（能）使类更易于使用，使用该类的系统（也）更易于调试。** 当对象被传递给 println、printf、字符串连接操作符或断言或由调试器打印时，将自动调用 toString 方法。即使你从来没有调用 toString 对象，其他人也可能（使用）。例如，有对象引用的组件可以在日志错误消息中包含对象的字符串表示。如果你未能覆盖 toString，则该消息可能完全无用。

If you’ve provided a good toString method for PhoneNumber,generating a useful diagnostic message is as easy as this:

> 如果你已经为 PhoneNumber 提供了一个好的 toString 方法，那么生成一个有用的诊断消息就像这样简单：

```java
System.out.println("Failed to connect to " + phoneNumber);
```

Programmers will generate diagnostic messages in this fashion whether or not you override toString, but the messages won’t be useful unless you do. The benefits of providing a good toString method extend beyond instances of the class to objects containing references to these instances, especially collections.Which would you rather see when printing a map,{Jenny=PhoneNumber@163b91} or {Jenny=707-867-5309}?

> 无论你是否覆盖 toString，程序员都会以这种方式生成诊断消息，但是除非你（覆盖 toString），否则这些消息不会有用。提供好的 toString 方法的好处不仅仅是将类的实例扩展到包含对这些实例的引用的对象，特别是集合。在打印 map 时，你更愿意看到哪个，{Jenny=PhoneNumber@163b91} 还是 {Jenny=707-867-5309}？

**When practical, the toString method should return all of the interesting information contained in the object,** as shown in the phone number example. It is impractical if the object is large or if it contains state that is not conducive to string representation. Under these circumstances,toString should return a summary such as Manhattan residential phone directory (1487536 listings) or Thread[main,5,main]. Ideally, the string should be self-explanatory. (The Thread example flunks this test.) A particularly annoying penalty for failing to include all of an object’s interesting information in its string representation is test failure reports that look like this:

> **当实际使用时，toString 方法应该返回对象中包含的所有有趣信息，** 如电话号码示例所示。如果对象很大，或者包含不利于字符串表示的状态，那么这种方法是不切实际的。在这种情况下，toString 应该返回一个摘要，例如曼哈顿住宅电话目录（1487536 号清单）或 Thread[main,5,main]。理想情况下，字符串应该是不言自明的。（线程示例未能通过此测试。）如果没有在字符串表示中包含所有对象的有趣信息，那么一个特别恼人的惩罚就是测试失败报告，如下所示：

```java
Assertion failure: expected {abc, 123}, but was {abc, 123}.
```

One important decision you’ll have to make when implementing a toString method is whether to specify the format of the return value in the documentation. It is recommended that you do this for value classes, such as phone number or matrix. The advantage of specifying the format is that it serves as a standard, unambiguous, human-readable representation of the object. This representation can be used for input and output and in persistent human-readable data objects, such as CSV files. If you specify the format, it’s usually a good idea to provide a matching static factory or constructor so programmers can easily translate back and forth between the object and its string representation. This approach is taken by many value classes in the Java platform libraries, including BigInteger, BigDecimal, and most of the boxed primitive classes.

> 在实现 toString 方法时，你必须做的一个重要决定是是否在文档中指定返回值的格式。建议你针对值类（如电话号码或矩阵）这样做。指定格式的优点是，它可以作为对象的标准的、明确的、人类可读的表示。这种表示可以用于输入和输出，也可以用于持久的人类可读数据对象，比如 CSV 文件。如果指定了格式，提供一个匹配的静态工厂或构造函数通常是一个好主意，这样程序员就可以轻松地在对象及其字符串表示之间来回转换。Java 库中的许多值类都采用这种方法，包括 BigInteger、BigDecimal 和大多数包装类。

The disadvantage of specifying the format of the toString return value is that once you’ve specified it, you’re stuck with it for life, assuming your class is widely used. Programmers will write code to parse the representation, to generate it, and to embed it into persistent data. If you change the representation in a future release, you’ll break their code and data, and they will yowl. By choosing not to specify a format, you preserve the flexibility to add information or improve the format in a subsequent release.

> 指定 toString 返回值的格式的缺点是，一旦指定了它，就会终生使用它，假设你的类被广泛使用。程序员将编写代码来解析表示、生成表示并将其嵌入持久数据中。如果你在将来的版本中更改了表示形式，你将破坏它们的代码和数据，它们将发出大量的消息。通过选择不指定格式，你可以保留在后续版本中添加信息或改进格式的灵活性。

**Whether or not you decide to specify the format, you should clearly document your intentions.** If you specify the format, you should do so precisely. For example, here’s a toString method to go with the PhoneNumber class in Item 11:

> **无论你是否决定指定格式，你都应该清楚地记录你的意图。** 如果指定了格式，则应该精确地指定格式。例如，这里有一个 toString 方法用于 Item-11 中的 PhoneNumber 类：

```java
/**
* Returns the string representation of this phone number.
* The string consists of twelve characters whose format is
* "XXX-YYY-ZZZZ", where XXX is the area code, YYY is the
* prefix, and ZZZZ is the line number. Each of the capital
* letters represents a single decimal digit.
**
If any of the three parts of this phone number is too small
* to fill up its field, the field is padded with leading zeros.
* For example, if the value of the line number is 123, the last
* four characters of the string representation will be "0123".
*/
@Override
public String toString() {
    return String.format("%03d-%03d-%04d", areaCode, prefix, lineNum);
}
```

If you decide not to specify a format, the documentation comment should read something like this:

> 如果你决定不指定一种格式，文档注释应该如下所示：

```java
/**
* Returns a brief description of this potion. The exact details
* of the representation are unspecified and subject to change,
* but the following may be regarded as typical:
**
"[Potion #9: type=love, smell=turpentine, look=india ink]"
*/
@Override
public String toString() { ... }
```

After reading this comment, programmers who produce code or persistent data that depends on the details of the format will have no one but themselves to blame when the format is changed.

> 在阅读了这篇文档注释之后，当格式被更改时，生成依赖于格式细节的代码或持久数据的程序员将只能怪他们自己。

Whether or not you specify the format, **provide programmatic access to the information contained in the value returned by toString.** For example, the PhoneNumber class should contain accessors for the area code, prefix, and line number. If you fail to do this, you force programmers who need this information to parse the string. Besides reducing performance and making unnecessary work for programmers, this process is error-prone and results in fragile systems that break if you change the format. By failing to provide accessors, you turn the string format into a de facto API, even if you’ve specified that it’s subject to change.

> 无论你是否指定了格式，都要 **提供对 toString 返回值中包含的信息的程序性访问。** 例如，PhoneNumber 类应该包含区域代码、前缀和行号的访问器。如果做不到这一点，就会迫使需要这些信息的程序员解析字符串。除了降低性能和使程序员不必要的工作之外，这个过程很容易出错，并且会导致脆弱的系统在你更改格式时崩溃。由于没有提供访问器，你可以将字符串格式转换为事实上的 API，即使你已经指定了它可能会发生更改。

It makes no sense to write a toString method in a static utility class (Item 4). Nor should you write a toString method in most enum types (Item 34) because Java provides a perfectly good one for you. You should, however, write a toString method in any abstract class whose subclasses share a common string representation. For example, the toString methods on most collection implementations are inherited from the abstract collection classes.

> 在静态实用程序类中编写 toString 方法是没有意义的（Item-4），在大多数 enum 类型中也不应该编写 toString 方法（Item-34），因为 Java 为你提供了一个非常好的方法。但是，你应该在任何抽象类中编写 toString 方法，该类的子类共享公共的字符串表示形式。例如，大多数集合实现上的 toString 方法都继承自抽象集合类。

Google’s open source AutoValue facility, discussed in Item 10, will generate a toString method for you, as will most IDEs. These methods are great for telling you the contents of each field but aren’t specialized to the meaning of the class. So, for example, it would be inappropriate to use an automatically generated toString method for our PhoneNumber class (as phone numbers have a standard string representation), but it would be perfectly acceptable for our Potion class. That said, an automatically generated toString method is far preferable to the one inherited from Object, which tells you nothing about an object’s value.

> 谷歌的开放源码自动值工具（在 Item-10 中讨论）将为你生成 toString 方法，大多数 IDE 也是如此。这些方法可以很好地告诉你每个字段的内容，但并不专门针对类的含义。因此，例如，对于 PhoneNumber 类使用自动生成的 toString 方法是不合适的（因为电话号码具有标准的字符串表示形式），但是对于 Potion 类来说它是完全可以接受的。也就是说，一个自动生成的 toString 方法要比从对象继承的方法好得多，对象继承的方法不会告诉你对象的值。

To recap, override Object’s toString implementation in every instantiable class you write, unless a superclass has already done so. It makes classes much more pleasant to use and aids in debugging. The toString method should return a concise, useful description of the object, in an aesthetically pleasing format.

> 回顾一下，在你编写的每个实例化类中覆盖对象的 toString 实现，除非超类已经这样做了。它使类更易于使用，并有助于调试。toString 方法应该以美观的格式返回对象的简明、有用的描述。

---

## 【13】明智地覆盖 clone 方法

> Override clone judiciously

The Cloneable interface was intended（目的） as a mixin interface (Item 20) for classes to advertise that they permit cloning. Unfortunately, it fails to serve this purpose. Its primary flaw（n. 瑕疵，缺点） is that it lacks a clone method, and Object’s clone method is protected. You cannot, without resorting（求助） to reflection (Item 65), invoke clone on an object merely（adv. 仅仅，只是） because it implements Cloneable.Even a reflective invocation may fail, because there is no guarantee（n. 保证；担保） that the object has an accessible clone method. Despite this flaw and many others, the facility（n. 设施；设备） is in reasonably wide use, so it pays to understand it. This item tells you how to implement a well-behaved clone method, discusses when it is appropriate to do so, and presents alternatives.

> Cloneable 接口的目的是作为 mixin 接口（Item-20），用于让类来宣称它们允许克隆。不幸的是，它没有达到这个目的。它的主要缺点是缺少 clone 方法，并且 Object 类的 clone 方法是受保护的。如果不求助于反射（Item-65），就不能仅仅因为对象实现了 Cloneable 就能调用 clone 方法。即使反射调用也可能失败，因为不能保证对象具有可访问的 clone 方法。尽管存在这样那样的缺陷，但该设施的使用范围相当广泛，因此理解它是值得的。本项目将告诉你如何实现行为良好的 clone 方法，讨论什么时候应该这样做，并提供替代方法。

**译注：mixin 是掺合，混合，糅合的意思，即可以将任意一个对象的全部或部分属性拷贝到另一个对象上。**

So what does Cloneable do, given that it contains no methods? It determines the behavior of Object’s protected clone implementation: if a class implements Cloneable, Object’s clone method returns a field-byfield copy of the object; otherwise it throws CloneNotSupportedException. This is a highly atypical use of interfaces and not one to be emulated. Normally, implementing an interface says something about what a class can do for its clients. In this case, it modifies the behavior of a protected method on a superclass.

> 如果 Cloneable 不包含任何方法，它会做什么呢？它决定 Object 的受保护克隆实现的行为：如果一个类实现了 Cloneable，对象的克隆方法返回对象的逐域拷贝；否则它会抛出 CloneNotSupportedException。这是接口的一种高度非典型使用，而不是可模仿的。通常，实现接口说明了类可以为其客户做些什么。在本例中，它修改了超类上受保护的方法行为。

Though the specification（n. 规格；说明书；详述） doesn’t say it, in practice, a class implementing Cloneable is expected to provide a properly（adv. 适当地；正确地；恰当地） functioning public clone method. In order to achieve（vt. 取得；获得；实现；） this, the class and all of its superclasses must obey a complex（adj. 复杂的；合成的）, unenforceable, thinly documented protocol. The resulting mechanism is fragile, dangerous, and extralinguistic（adj. 语言以外的；语言学以外的）: it creates objects without calling a constructor.

> 虽然规范没有说明，但是在实践中，一个实现 Cloneable 的类应该提供一个功能正常的公共 clone 方法。为了实现这一点，类及其所有超类必须遵守复杂的、不可强制执行的、文档很少的协议。产生的机制是脆弱的、危险的和非语言的：即它创建对象而不调用构造函数。

The general contract for the clone method is weak. Here it is, copied from the Object specification（n. 规格；说明书；详述） :

> clone 方法的一般约定很薄弱。这里是从 Object 规范复制过来的：

Creates and returns a copy of this object. The precise meaning of “copy” may depend on the class of the object. The general intent（n. 意图；目的；含义，adj. 专心的；急切的；坚决的） is that, for any object x,the expression

> 创建并返回此对象的副本。「复制」的确切含义可能取决于对象的类别。一般的目的是，对于任何对象 x，表达式

```java
x.clone() != x
```

will be true, and the expression

> 值将为 true，并且这个表达式

```java
x.clone().getClass() == x.getClass()
```

will be true, but these are not absolute requirements（n. 要求；必要条件；）. While it is typically the case that

> 值将为 true，但这些不是绝对的必要条件。通常情况下

```java
x.clone().equals(x)
```

will be true, this is not an absolute requirement.

> 值将为 true，但这些不是绝对的必要条件。

By convention（n. 大会；惯例；约定；协定；习俗）, the object returned by this method should be obtained（v. 获得） by calling super.clone. If a class and all of its superclasses (except Object) obey this convention, it will be the case that

> 按照惯例，这个方法返回的对象应该通过调用 super.clone 来获得。如果一个类和它的所有超类（对象除外）都遵守这个约定，那么情况就是这样

```java
x.clone().getClass() == x.getClass().
```

By convention, the returned object should be independent of the object being cloned. To achieve this independence, it may be necessary to modify one or more fields of the object returned by super.clone before returning it.

> 按照惯例，返回的对象应该独立于被克隆的对象。为了实现这种独立性，可能需要修改 super 返回的对象的一个或多个字段。在返回之前克隆。

This mechanism is vaguely similar to constructor chaining, except that it isn’t enforced: if a class’s clone method returns an instance that is not obtained by calling super.clone but by calling a constructor, the compiler won’t complain, but if a subclass of that class calls super.clone, the resulting object will have the wrong class, preventing the subclass from clone method from working properly. If a class that overrides clone is final, this convention may be safely ignored, as there are no subclasses to worry about. But if a final class has a clone method that does not invoke super.clone, there is no reason for the class to implement Cloneable, as it doesn’t rely on the behavior of Object’s clone implementation.

> 这种机制有点类似于构造函数链接，只是没有强制执行：如果一个类的克隆方法返回的实例不是通过调用 super.clone 而是通过调用构造函数获得的，编译器不会抱怨，但是如果这个类的一个子类调用 super.clone,由此产生的对象将有错误的类,防止子类克隆方法从正常工作。如果覆盖克隆的类是 final 的，那么可以安全地忽略这个约定，因为不需要担心子类。但是如果 final 类有一个不调用 super 的克隆方法。类没有理由实现 Cloneable，因为它不依赖于对象克隆实现的行为。

Suppose you want to implement Cloneable in a class whose superclass provides a well-behaved clone method. First call super.clone. The object you get back will be a fully functional replica of the original. Any fields declared in your class will have values identical to those of the original. If every field contains a primitive value or a reference to an immutable object, the returned object may be exactly what you need, in which case no further processing is necessary. This is the case, for example, for the PhoneNumber class in Item 11, but note that **immutable classes should never provide a clone method** because it would merely encourage wasteful copying. With that caveat, here’s how a clone method for PhoneNumber would look:

> 假设你希望在一个类中实现 Cloneable，该类的超类提供了一个表现良好的克隆方法。第一个叫 super.clone。返回的对象将是原始对象的完整功能副本。类中声明的任何字段都具有与原始字段相同的值。如果每个字段都包含一个基元值或对不可变对象的引用，那么返回的对象可能正是你所需要的，在这种情况下不需要进一步的处理。例如，对于 Item-11 中的 PhoneNumber 类就是这样，但是要注意，**不可变类永远不应该提供克隆方法**，因为它只会鼓励浪费复制。有了这个警告，以下是 PhoneNumber 的克隆方法的外观：

```java
// Clone method for class with no references to mutable state
@Override public PhoneNumber clone() {
    try {
        return (PhoneNumber) super.clone();
    } catch (CloneNotSupportedException e) {
        throw new AssertionError(); // Can't happen
    }
}
```

In order for this method to work, the class declaration for PhoneNumber would have to be modified to indicate that it implements Cloneable. Though Object’s clone method returns Object, this clone method returns PhoneNumber. It is legal and desirable to do this because Java supports covariant return types. In other words, an overriding method’s return type can be a subclass of the overridden method’s return type. This eliminates the need for casting in the client. We must cast the result of super.clone from Object to PhoneNumber before returning it, but the cast is guaranteed to succeed.

> 为了让这个方法工作，必须修改 PhoneNumber 的类声明，以表明它实现了 Cloneable。虽然 Object 的 clone 方法返回 Object，但是这个 clone 方法返回 PhoneNumber。这样做是合法的，也是可取的，因为 Java 支持协变返回类型。换句话说，覆盖方法的返回类型可以是被覆盖方法的返回类型的子类。这样就不需要在客户端中进行强制转换。我们必须打出超级的成绩。在返回对象之前从对象克隆到 PhoneNumber，但强制转换肯定会成功。

The call to super.clone is contained in a try-catch block. This is because Object declares its clone method to throw CloneNotSupportedException, which is a checked exception. Because PhoneNumber implements Cloneable, we know the call to super.clone will succeed. The need for this boilerplate indicates that CloneNotSupportedException should have been unchecked (Item 71).

> 对 super.clone 的调用包含在 try-catch 块中。这是因为 Object 声明其克隆方法来抛出 CloneNotSupportedException。因为 PhoneNumber 实现了 Cloneable，所以我们知道对 super.clone 的调用将会成功。这个样板文件的需要表明 CloneNotSupportedException 应该是被选中的（Item-71）。

If an object contains fields that refer to mutable objects, the simple clone implementation shown earlier can be disastrous. For example, consider the Stack class in Item 7:

> 如果对象包含引用可变对象的字段，前面所示的简单克隆实现可能是灾难性的。例如，考虑 Item-7 中的堆栈类：

```java
public class Stack {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public Stack() {
      this.elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(Object e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public Object pop() {
        if (size == 0)
            throw new EmptyStackException();
        Object result = elements[--size];
        elements[size] = null; // Eliminate obsolete reference
        return result;
    }

    // Ensure space for at least one more element.
    private void ensureCapacity() {
        if (elements.length == size)
            elements = Arrays.copyOf(elements, 2 * size + 1);
    }
}
```

Suppose you want to make this class cloneable. If the clone method merely（adv. 仅仅，只不过；只是） returns super.clone(), the resulting Stack instance will have the correct value in its size field, but its elements field will refer to the same array as the original Stack instance. Modifying the original will destroy the invariants in the clone and vice versa. You will quickly find that your program produces nonsensical results or throws a NullPointerException.

> 假设你想让这个类是可克隆的。如果克隆方法只返回 super.clone()，则结果堆栈实例在其大小字段中将有正确的值，但其元素字段将引用与原始堆栈实例相同的数组。修改初始值将破坏克隆中的不变量，反之亦然。你将很快发现你的程序产生了无意义的结果或抛出 NullPointerException。

This situation could never occur as a result of calling the sole constructor in the Stack class. In effect, the clone method functions as a constructor;you must ensure that it does no harm to the original object and that it properly establishes invariants on the clone. In order for the clone method on Stack to work properly, it must copy the internals of the stack. The easiest way to do this is to call clone recursively on the elements array:

> 由于调用堆栈类中的唯一构造函数，这种情况永远不会发生。实际上，clone 方法充当构造函数;你必须确保它不会对原始对象造成伤害，并且在克隆上正确地建立不变量。为了使堆栈上的克隆方法正常工作，它必须复制堆栈的内部。最简单的方法是在元素数组上递归地调用 clone：

```java
// Clone method for class with references to mutable state
@Override
public Stack clone() {
    try {
        Stack result = (Stack) super.clone();
        result.elements = elements.clone();
        return result;
    } catch (CloneNotSupportedException e) {
        throw new AssertionError();
    }
}
```

Note that we do not have to cast the result of elements.clone to Object[]. Calling clone on an array returns an array whose runtime and compile-time types are identical to those of the array being cloned. This is the preferred idiom to duplicate an array. In fact, arrays are the sole compelling use of the clone facility（n. 设施；设备；容易；灵巧）.

> 注意，我们不需要将 `elements.clone` 的结果强制转换到 `Object[]`。在数组上调用 clone 将返回一个数组，该数组的运行时和编译时类型与被克隆的数组相同。这是复制数组的首选习惯用法。实际上，数组是 clone 工具唯一引人注目的用途。

Note also that the earlier solution would not work if the elements field were final because clone would be prohibited from assigning a new value to the field. This is a fundamental problem: like serialization, the Cloneable architecture is incompatible with normal use of final fields referring to mutable objects, except in cases where the mutable objects may be safely shared between an object and its clone. In order to make a class cloneable, it may be necessary to remove final modifiers from some fields.

> 还要注意，如果元素字段是 final 的，早期的解决方案就无法工作，因为克隆将被禁止为字段分配新值。这是一个基本问题：与序列化一样，可克隆体系结构与正常使用引用可变对象的 final 字段不兼容，除非在对象与其克隆对象之间可以安全地共享可变对象。为了使类可克隆，可能需要从某些字段中删除最终修饰符。

It is not always sufficient（adj. 足够的；充分的） merely to call clone recursively. For example,suppose you are writing a clone method for a hash table whose internals consist of an array of buckets, each of which references the first entry in a linked list of key-value pairs. For performance, the class implements its own lightweight singly linked list instead of using java.util.LinkedList internally:

> 仅仅递归地调用克隆并不总是足够的。例如，假设你正在为 hash 表编写一个克隆方法， hash 表的内部由一组 bucket 组成，每个 bucket 引用键-值对链表中的第一个条目。为了提高性能，类实现了自己的轻量级单链表，而不是在内部使用 `java.util.LinkedList`：

```java
public class HashTable implements Cloneable {
    private Entry[] buckets = ...;

    private static class Entry {
        final Object key;
        Object value;
        Entry next;

        Entry(Object key, Object value, Entry next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }
    } ... // Remainder omitted
}
```

Suppose you merely clone the bucket array recursively, as we did for Stack:

> 假设你只是递归地克隆 bucket 数组，就像我们对 Stack 所做的那样：

```java
// Broken clone method - results in shared mutable state!
@Override
public HashTable clone() {
    try {
        HashTable result = (HashTable) super.clone();
        result.buckets = buckets.clone();
        return result;
    } catch (CloneNotSupportedException e) {
        throw new AssertionError();
    }
}
```

Though the clone has its own bucket array, this array references the same linked lists as the original, which can easily cause nondeterministic behavior in both the clone and the original. To fix this problem, you’ll have to copy the linked list that comprises each bucket. Here is one common approach:

> 尽管克隆具有自己的 bucket 数组，但该数组引用的链接列表与原始链表相同，这很容易导致克隆和原始的不确定性行为。要解决这个问题，你必须复制包含每个 bucket 的链表。这里有一个常见的方法：

```java
// Recursive clone method for class with complex mutable state
public class HashTable implements Cloneable {

private Entry[] buckets = ...;

    private static class Entry {
        final Object key;
        Object value;
        Entry next;

        Entry(Object key, Object value, Entry next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }

        // Recursively copy the linked list headed by this Entry
        Entry deepCopy() {
            return new Entry(key, value,next == null ? null : next.deepCopy());
        }
    }

    @Override
    public HashTable clone() {
        try {
            HashTable result = (HashTable) super.clone();
            result.buckets = new Entry[buckets.length];

            for (int i = 0; i < buckets.length; i++)
                if (buckets[i] != null)
                    result.buckets[i] = buckets[i].deepCopy();

            return result;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    } ... // Remainder omitted
}
```

The private class HashTable.Entry has been augmented to support a “deep copy” method. The clone method on HashTable allocates a new buckets array of the proper size and iterates over the original buckets array,deep-copying each nonempty bucket. The deepCopy method on Entry invokes itself recursively to copy the entire linked list headed by the entry. While this technique is cute and works fine if the buckets aren’t too long, it is not a good way to clone a linked list because it consumes one stack frame for each element in the list. If the list is long, this could easily cause a stack overflow. To prevent this from happening, you can replace the recursion in deepCopy with iteration:

> 私有类 HashTable.Entry 已经被增强为支持「深度复制」方法。HashTable 上的 clone 方法分配一个大小合适的新 bucket 数组，并遍历原始 bucket 数组，深度复制每个非空 bucket。条目上的 deepCopy 方法会递归地调用自己来复制以条目开头的整个链表。虽然这种技术很可爱，而且如果 bucket 不太长也可以很好地工作，但是克隆链表并不是一个好方法，因为它为链表中的每个元素消耗一个堆栈帧。如果列表很长，很容易导致堆栈溢出。为了防止这种情况的发生，你可以用迭代替换 deepCopy 中的递归：

```java
// Iteratively copy the linked list headed by this Entry
Entry deepCopy() {
    Entry result = new Entry(key, value, next);
    for (Entry p = result; p.next != null; p = p.next)
        p.next = new Entry(p.next.key, p.next.value, p.next.next);
    return result;
}
```

A final approach to cloning complex mutable objects is to call super.clone, set all of the fields in the resulting object to their initial state,and then call higher-level methods to regenerate the state of the original object. In the case of our HashTable example, the buckets field would be initialized to a new bucket array, and the put(key, value) method (not shown) would be invoked for each key-value mapping in the hash table being cloned. This approach typically yields a simple, reasonably elegant clone method that does not run as quickly as one that directly manipulates the innards of the clone. While this approach is clean, it is antithetical to the whole Cloneable architecture because it blindly overwrites the field-by-field object copy that forms the basis of the architecture.

> 克隆复杂可变对象的最后一种方法是调用 super.clone，将结果对象中的所有字段设置为初始状态，然后调用更高级别的方法重新生成原始对象的状态。在我们的 HashTable 示例中，bucket 字段将初始化为一个新的 bucket 数组，并且对于克隆的 hash 表中的每个键值映射将调用 put(key, value)方法（未显示）。这种方法通常产生一个简单、相当优雅的克隆方法，它的运行速度不如直接操作克隆的内部的方法快。虽然这种方法很简洁，但它与整个可克隆体系结构是对立的，因为它盲目地覆盖了构成体系结构基础的逐字段对象副本。

Like a constructor, a clone method must never invoke an overridable method on the clone under construction (Item 19). If clone invokes a method that is overridden in a subclass, this method will execute before the subclass has had a chance to fix its state in the clone, quite possibly leading to corruption in the clone and the original. Therefore, the put(key, value) method discussed in the previous paragraph should be either final or private. (If it is private, it is presumably the “helper method” for a nonfinal public method.)

> 与构造函数一样，克隆方法决不能在正在构建的克隆上调用可覆盖方法（Item-19）。如果 clone 调用一个在子类中被重写的方法，这个方法将在子类有机会修复其在克隆中的状态之前执行，很可能导致克隆和原始的破坏。因此，前一段中讨论的 put(key, value)方法应该是 final 或 private 方法。（如果它是私有的，那么它可能是非最终公共方法的「助手方法」。)

Object’s clone method is declared to throw CloneNotSupportedException, but overriding methods need not. **Public clone methods should omit the throws clause,** as methods that don’t throw checked exceptions are easier to use (Item 71).

> 对象的 clone 方法被声明为抛出 CloneNotSupportedException，但是重写方法不需要。**公共克隆方法应该省略 throw 子句，** 作为不抛出受控异常的方法更容易使用（Item-71）。

You have two choices when designing a class for inheritance (Item 19), but whichever one you choose, the class should not implement Cloneable. You may choose to mimic the behavior of Object by implementing a properly functioning protected clone method that is declared to throw CloneNotSupportedException. This gives subclasses the freedom to implement Cloneable or not, just as if they extended Object directly.Alternatively, you may choose not to implement a working clone method, and to prevent subclasses from implementing one, by providing the following degenerate clone implementation:

> 在为继承设计类时，你有两种选择（Item-19），但是无论你选择哪一种，类都不应该实现 Cloneable。你可以选择通过实现一个功能正常的受保护克隆方法来模拟对象的行为，该方法声明为抛出 CloneNotSupportedException。这给子类实现 Cloneable 或不实现 Cloneable 的自由，就像它们直接扩展对象一样。或者，你可以选择不实现工作克隆方法，并通过提供以下简并克隆实现来防止子类实现一个工作克隆方法：

```java
// clone method for extendable class not supporting Cloneable
@Override
protected final Object clone() throws CloneNotSupportedException {
    throw new CloneNotSupportedException();
}
```

There is one more detail that bears noting. If you write a thread-safe class that implements Cloneable, remember that its clone method must be properly synchronized, just like any other method (Item 78). Object’s clone method is not synchronized, so even if its implementation is otherwise satisfactory, you may have to write a synchronized clone method that returns super.clone().

> 还有一个细节需要注意。如果你编写了一个实现了 Cloneable 的线程安全类，请记住它的克隆方法必须正确同步，就像其他任何方法一样（Item-78）。对象的克隆方法不是同步的，因此即使它的实现在其他方面是令人满意的，你也可能需要编写一个返回 super.clone()的同步克隆方法。

To recap, all classes that implement Cloneable should override clone with a public method whose return type is the class itself. This method should first call super.clone, then fix any fields that need fixing. Typically, this means copying any mutable objects that comprise the internal “deep structure” of the object and replacing the clone’s references to these objects with references to their copies. While these internal copies can usually be made by calling clone recursively, this is not always the best approach. If the class contains only primitive fields or references to immutable objects, then it is likely the case that no fields need to be fixed. There are exceptions to this rule. For example, a field representing a serial number or other unique ID will need to be fixed even if it is primitive or immutable.

> 回顾一下，所有实现 Cloneable 的类都应该使用一个返回类型为类本身的公共方法覆盖 clone。这个方法应该首先调用 super.clone，然后修复任何需要修复的字段。通常，这意味着复制任何包含对象内部「深层结构」的可变对象，并将克隆对象对这些对象的引用替换为对其副本的引用。虽然这些内部副本通常可以通过递归调用 clone 来实现，但这并不总是最好的方法。如果类只包含基元字段或对不可变对象的引用，那么很可能不需要修复任何字段。这条规则也有例外。例如，表示序列号或其他唯一 ID 的字段需要固定，即使它是原始的或不可变的。

Is all this complexity really necessary? Rarely. If you extend a class that already implements Cloneable, you have little choice but to implement a well-behaved clone method. Otherwise, you are usually better off providing an alternative means of object copying. A better approach to object copying is to provide a copy constructor or copy factory. A copy constructor is simply a constructor that takes a single argument whose type is the class containing the constructor, for example,

> 所有这些复杂性真的有必要吗？很少。如果你扩展了一个已经实现了 Cloneable 的类，那么除了实现行为良好的克隆方法之外，你别无选择。否则，最好提供对象复制的替代方法。一个更好的对象复制方法是提供一个复制构造函数或复制工厂。复制构造函数是一个简单的构造函数，它接受单个参数，其类型是包含构造函数的类，例如，

```java
// Copy constructor
public Yum(Yum yum) { ... };
```

A copy factory is the static factory (Item 1) analogue of a copy constructor:

> 复制工厂是复制构造函数的静态工厂（Item-1）类似物：

```java
// Copy factory
public static Yum newInstance(Yum yum) { ... };
```

The copy constructor approach and its static factory variant have many advantages over Cloneable/clone: they don’t rely on a risk-prone extralinguistic object creation mechanism; they don’t demand unenforceable adherence to thinly documented conventions; they don’t conflict with the proper use of final fields; they don’t throw unnecessary checked exceptions; and they don’t require casts.

> 复制构造函数方法及其静态工厂变体与克隆/克隆相比有许多优点：它们不依赖于易发生风险的语言外对象创建机制；他们不要求无法强制执行的约定；它们与最终字段的正确使用不冲突；它们不会抛出不必要的检查异常；而且不需要强制类型转换。

Furthermore, a copy constructor or factory can take an argument whose type is an interface implemented by the class. For example, by convention all generalpurpose collection implementations provide a constructor whose argument is of type Collection or Map. Interface-based copy constructors and factories,more properly known as conversion constructors and conversion factories, allow the client to choose the implementation type of the copy rather than forcing the client to accept the implementation type of the original. For example, suppose you have a HashSet, s, and you want to copy it as a TreeSet. The clone method can’t offer this functionality, but it’s easy with a conversion constructor:new TreeSet<>(s).

> 此外，复制构造函数或工厂可以接受类型为类实现的接口的参数。例如，按照约定，所有通用集合实现都提供一个构造函数，其参数为 collection 或 Map 类型。基于接口的复制构造函数和工厂（更确切地称为转换构造函数和转换工厂）允许客户端选择副本的实现类型，而不是强迫客户端接受原始的实现类型。例如，假设你有一个 HashSet s，并且希望将它复制为 TreeSet。克隆方法不能提供这种功能，但是使用转换构造函数很容易：new TreeSet<>(s)。

Given all the problems associated（adj. 关联的；联合的） with Cloneable, new interfaces should not extend it, and new extendable classes should not implement it. While it’s less harmful for final classes to implement Cloneable, this should be viewed as a performance optimization, reserved for the rare cases where it is justified (Item 67). As a rule, copy functionality is best provided by constructors or factories. A notable exception to this rule is arrays, which are best copied with the clone method.

> 考虑到与 Cloneable 相关的所有问题，新的接口不应该扩展它，新的可扩展类不应该实现它。虽然 final 类实现 Cloneable 的危害要小一些，但这应该被视为一种性能优化，仅在极少数情况下（Item-67）是合理的。通常，复制功能最好由构造函数或工厂提供。这个规则的一个明显的例外是数组，最好使用 clone 方法来复制数组。

---

## 【14】考虑实现 Comparable 接口

> Consider implementing Comparable

Unlike the other methods discussed in this chapter, the compareTo method is not declared in Object. Rather, it is the sole method in the Comparable interface. It is similar in character to Object’s equals method, except that it permits order comparisons in addition to simple equality comparisons, and it is generic. By implementing Comparable, a class indicates that its instances have a natural ordering. Sorting an array of objects that implement Comparable is as simple as this:

> 与本章讨论的其他方法不同，compareTo 方法不是在 Object 中声明的。相反，它是 Comparable 接口中的唯一方法。它在性质上类似于 Object 的 equals 方法，除了简单的相等比较之外，它还允许顺序比较，而且它是通用的。一个类实现 Comparable，表明实例具有自然顺序。对实现 Comparable 的对象数组进行排序非常简单：

```java
Arrays.sort(a);
```

It is similarly easy to search, compute extreme values, and maintain automatically sorted collections of Comparable objects. For example, the following program, which relies on the fact that String implements Comparable, prints an alphabetized list of its command-line arguments with duplicates eliminated:

> 类似地，搜索、计算极值和维护 Comparable 对象的自动排序集合也很容易。例如，下面的程序依赖于 String 实现 Comparable 这一事实，将命令行参数列表按字母顺序打印出来，并消除重复：

```java
public class WordList {
    public static void main(String[] args) {
        Set<String> s = new TreeSet<>();
        Collections.addAll(s, args);
        System.out.println(s);
    }
}
```

By implementing Comparable, you allow your class to interoperate with all of the many generic algorithms and collection implementations that depend on this interface. You gain a tremendous amount of power for a small amount of effort. Virtually all of the value classes in the Java platform libraries, as well as all enum types (Item 34), implement Comparable. If you are writing a value class with an obvious natural ordering, such as alphabetical order, numerical order, or chronological order, you should implement the Comparable interface:

> 通过让类实现 Comparable，就可与依赖于此接口的所有通用算法和集合实现进行互操作。你只需付出一点点努力就能获得强大的功能。实际上，Java 库中的所有值类以及所有枚举类型（Item-34）都实现了 Comparable。如果编写的值类具有明显的自然顺序，如字母顺序、数字顺序或时间顺序，则应实现 Comparable 接口：

```java
public interface Comparable<T> {
    int compareTo(T t);
}
```

The general contract of the compareTo method is similar to that of equals:

> compareTo 方法的一般约定类似于 equals 方法：

Compares this object with the specified object for order. Returns a negative integer, zero, or a positive integer as this object is less than, equal to, or greater than the specified object. Throws ClassCastException if the specified object’s type prevents it from being compared to this object.

> 将一个对象与指定的对象进行顺序比较。当该对象小于、等于或大于指定对象时，对应返回一个负整数、零或正整数。如果指定对象的类型阻止它与该对象进行比较，则抛出 ClassCastException。

In the following description, the notation sgn(expression) designates the mathematical signum function, which is defined to return -1, 0, or 1,according to whether the value of expression is negative, zero, or positive.

> 在下面的描述中，`sgn(expression)` 表示数学中的符号函数，它被定义为：根据传入表达式的值是负数、零或正数，对应返回 -1、0 或 1。

- The implementor must ensure that sgn(x.compareTo(y)) == -sgn(y. compareTo(x)) for all x and y. (This implies that x.compareTo(y) must throw an exception if and only if y.compareTo(x) throws an exception.)

> 实现者必须确保所有 x 和 y 满足 `sgn(x.compareTo(y)) == -sgn(y)`（这意味着 `x.compareTo(y)` 当且仅当 `y.compareTo(x)` 抛出异常时才抛出异常）。

- The implementor must also ensure that the relation is transitive: (x.compareTo(y) > 0 && y.compareTo(z) > 0) implies x.compareTo(z) > 0.

> 实现者还必须确保关系是可传递的：`(x.compareTo(y) > 0 && y.compareTo(z) > 0)` 意味着 `x.compareTo(z) > 0`。

- Finally, the implementor must ensure that x.compareTo(y) == 0 implies that sgn(x.compareTo(z)) == sgn(y.compareTo(z)),for all z.

> 最后，实现者必须确保 `x.compareTo(y) == 0` 时，所有的 z 满足 `sgn(x.compareTo(z)) == sgn(y.compareTo(z))`。

- It is strongly recommended, but not required, that (x.compareTo(y)== 0) == (x.equals(y)). Generally speaking, any class that implements the Comparable interface and violates this condition should clearly indicate this fact. The recommended language is “Note: This class has a natural ordering that is inconsistent with equals.”

> 强烈建议 `(x.compareTo(y)== 0) == (x.equals(y))` 成立，但不是必需的。一般来说，任何实现 Comparable 接口并违反此条件的类都应该清楚地注明这一事实。推荐使用的表述是「注意：该类的自然顺序与 equals 不一致。」

Don’t be put off by the mathematical nature of this contract. Like the equals contract (Item 10), this contract isn’t as complicated as it looks. Unlike the equals method, which imposes a global equivalence relation on all objects,compareTo doesn’t have to work across objects of different types: when confronted with objects of different types, compareTo is permitted to throw ClassCastException. Usually, that is exactly what it does. The contract does permit intertype comparisons, which are typically defined in an interface implemented by the objects being compared.

> 不要被这些约定的数学性质所影响。就像 equals 约定（Item-10）一样，这个约定并不像看起来那么复杂。与 equals 方法不同，equals 方法对所有对象都施加了全局等价关系，compareTo 不需要跨越不同类型的对象工作：当遇到不同类型的对象时，compareTo 允许抛出 ClassCastException。通常，它就是这么做的。该约定确实允许类型间比较，这种比较通常在被比较对象实现的接口中定义。

Just as a class that violates the hashCode contract can break other classes that depend on hashing, a class that violates the compareTo contract can break other classes that depend on comparison. Classes that depend on comparison include the sorted collections TreeSet and TreeMap and the utility classes Collections and Arrays, which contain searching and sorting algorithms.

> 就像违反 hashCode 约定的类可以破坏依赖 hash 的其他类一样，违反 compareTo 约定的类也可以破坏依赖 Comparable 的其他类。依赖 Comparable 的类包括排序集合 TreeSet 和 TreeMap，以及实用工具类 Collections 和 Arrays，它们都包含搜索和排序算法。

Let’s go over the provisions of the compareTo contract. The first provision says that if you reverse the direction of a comparison between two object references, the expected thing happens: if the first object is less than the second,then the second must be greater than the first; if the first object is equal to the second, then the second must be equal to the first; and if the first object is greater than the second, then the second must be less than the first. The second provision says that if one object is greater than a second and the second is greater than a third, then the first must be greater than the third. The final provision says that all objects that compare as equal must yield the same results when compared to any other object.

> 让我们看一下 compareTo 约定的细节。第一个规定指出，如果你颠倒两个对象引用之间的比较的方向，就应当发生这样的情况：如果第一个对象小于第二个对象，那么第二个对象必须大于第一个；如果第一个对象等于第二个对象，那么第二个对象一定等于第一个对象；如果第一个对象大于第二个对象，那么第二个对象一定小于第一个对象。第二个规定指出，如果一个对象大于第二个，第二个大于第三个，那么第一个对象一定大于第三个对象。最后一个规定指出，所有 compareTo 结果为相等的对象分别与任何其他对象相比，必须产生相同的结果。

One consequence of these three provisions is that the equality test imposed by a compareTo method must obey the same restrictions imposed by the equals con-tract: reflexivity, symmetry, and transitivity. Therefore, the same caveat applies: there is no way to extend an instantiable class with a new value component while preserving the compareTo contract, unless you are willing to forgo the benefits of object-oriented abstraction (Item 10). The same workaround applies, too. If you want to add a value component to a class that implements Comparable, don’t extend it; write an unrelated class containing an instance of the first class. Then provide a “view” method that returns the contained instance. This frees you to implement whatever compareTo method you like on the containing class, while allowing its client to view an instance of the containing class as an instance of the contained class when needed.

> 这三种规定的一个结果是，由 compareTo 方法进行的相等性检验必须遵守由 equals 约定进行的相同的限制：反身性、对称性和传递性。因此，同样的警告也适用于此：除非你愿意放弃面向对象的抽象优点（Item-10），否则无法在保留 compareTo 约定的同时使用新值组件扩展可实例化类。同样的解决方案也适用。如果要向实现 Comparable 的类中添加值组件，不要继承它；编写一个不相关的类，其中包含第一个类的实例。然后提供返回所包含实例的「视图」方法。这使你可以自由地在包含类上实现你喜欢的任何 compareTo 方法，同时允许它的客户端在需要时将包含类的实例视为包含类的实例。

The final paragraph of the compareTo contract, which is a strong suggestion rather than a true requirement, simply states that the equality test imposed by the compareTo method should generally return the same results as the equals method. If this provision is obeyed, the ordering imposed by the compareTo method is said to be consistent with equals. If it’s violated, the ordering is said to be inconsistent with equals. A class whose compareTo method imposes an order that is inconsistent with equals will still work, but sorted collections containing elements of the class may not obey the general contract of the appropriate collection interfaces (Collection, Set, or Map). This is because the general contracts for these interfaces are defined in terms of the equals method, but sorted collections use the equality test imposed by compareTo in place of equals. It is not a catastrophe if this happens, but it’s something to be aware of.

> compareTo 约定的最后一段是一个强烈的建议，而不是一个真正的要求，它只是简单地说明了 compareTo 方法所施加的同等性检验通常应该与 equals 方法返回相同的结果。如果遵守了这一规定，则 compareTo 方法所施加的排序与 equals 方法一致。如果违反这条建议，那么它的顺序就与 equals 不一致。如果一个类的 compareTo 方法强加了一个与 equals 不一致的顺序，那么这个类仍然可以工作，但是包含该类元素的有序集合可能无法遵守集合接口（Collection、Set 或 Map）的一般约定。这是因为这些接口的一般约定是根据 equals 方法定义的，但是有序集合使用 compareTo 代替了 equals 实施同等性检验。如果发生这种情况，这不是一场灾难，但这是需要注意的。

For example, consider the BigDecimal class, whose compareTo method is inconsistent with equals. If you create an empty HashSet instance and then add new BigDecimal("1.0") and new BigDecimal("1.00"),the set will contain two elements because the two BigDecimal instances added to the set are unequal when compared using the equals method. If,however, you perform the same procedure using a TreeSet instead of a HashSet, the set will contain only one element because the two BigDecimal instances are equal when compared using the compareTo method. (See the BigDecimal documentation for details.)

> 例如，考虑 BigDecimal 类，它的 compareTo 方法与 equals 不一致。如果你创建一个空的 HashSet 实例，然后添加 `new BigDecimal("1.0")` 和 `new BigDecimal("1.00")`，那么该 HashSet 将包含两个元素，因为添加到该集合的两个 BigDecimal 实例在使用 equals 方法进行比较时结果是不相等的。但是，如果你使用 TreeSet 而不是 HashSet 执行相同的过程，那么该集合将只包含一个元素，因为使用 compareTo 方法比较两个 BigDecimal 实例时结果是相等的。（有关详细信息，请参阅 BigDecimal 文档。）

Writing a compareTo method is similar to writing an equals method, but there are a few key differences. Because the Comparable interface is parameterized, the compareTo method is statically typed, so you don’t need to type check or cast its argument. If the argument is of the wrong type, the invocation won’t even compile. If the argument is null, the invocation should throw a NullPointerException, and it will, as soon as the method attempts to access its members.

> 编写 compareTo 方法类似于编写 equals 方法，但是有一些关键的区别。因为 Comparable 接口是参数化的，compareTo 方法是静态类型的，所以不需要进行类型检查或强制转换它的参数。如果参数类型错误，则该调用将不能编译。如果参数为 null，则调用应该抛出 NullPointerException，并且在方法尝试访问其成员时抛出该异常。

In a compareTo method, fields are compared for order rather than equality. To compare object reference fields, invoke the compareTo method recursively. If a field does not implement Comparable or you need a nonstandard ordering, use a Comparator instead. You can write your own comparator or use an existing one, as in this compareTo method for CaseInsensitiveString in Item 10:

> 在 compareTo 方法中，字段是按顺序而不是按同等性来比较的。要比较对象引用字段，要递归调用 compareTo 方法。如果一个字段没有实现 Comparable，或者需要一个非标准的排序，那么应使用 Comparator。可以编写自定义的比较器，或使用现有的比较器，如 Item-10 中 CaseInsensitiveString 的 compareTo 方法：

```java
// Single-field Comparable with object reference field
public final class CaseInsensitiveString implements Comparable<CaseInsensitiveString> {
    public int compareTo(CaseInsensitiveString cis) {
        return String.CASE_INSENSITIVE_ORDER.compare(s, cis.s);
    } ... // Remainder omitted
}
```

Note that CaseInsensitiveString implements `Comparable<CaseInsensitiveString>`. This means that a CaseInsensitiveString reference can be compared only to another CaseInsensitiveString reference. This is the normal pattern to follow when declaring a class to implement Comparable.

> 注意 CaseInsensitiveString 实现了 `Comparable<CaseInsensitiveString>`。这意味着 CaseInsensitiveString 引用只能与另一个 CaseInsensitiveString 引用进行比较。这是在声明实现 Comparable 的类时要遵循的常规模式。

Prior editions of this book recommended that compareTo methods compare integral primitive fields using the relational operators < and >, and floating point primitive fields using the static methods Double.compare and Float.compare. In Java 7, static compare methods were added to all of Java’s boxed primitive classes. **Use of the relational operators < and > in compareTo methods is verbose and error-prone and no longer recommended.**

> 本书的旧版本建议 compareTo 方法使用关系运算符 < 和 > 来比较整数基本类型字段，使用静态方法 `Double.compare` 和 `Float.compare` 来比较浮点基本类型字段。在 Java 7 中，静态比较方法被添加到所有 Java 的包装类中。**在 compareTo 方法中使用关系运算符 < 和 > 冗长且容易出错，因此不再推荐使用。**

If a class has multiple significant fields, the order in which you compare them is critical. Start with the most significant field and work your way down. If a comparison results in anything other than zero (which represents equality),you’re done; just return the result. If the most significant field is equal, compare the next-most-significant field, and so on, until you find an unequal field or compare the least significant field. Here is a compareTo method for the PhoneNumber class in Item 11 demonstrating this technique:

> 如果一个类有多个重要字段，那么比较它们的顺序非常关键。从最重要的字段开始，一步步往下。如果比较的结果不是 0（用 0 表示相等），那么就完成了；直接返回结果。如果最重要的字段是相等的，就比较下一个最重要的字段，以此类推，直到找到一个不相等的字段或比较到最不重要的字段为止。下面是 Item-11 中 PhoneNumber 类的 compareTo 方法，演示了这种技术：

```java
// Multiple-field Comparable with primitive fields
public int compareTo(PhoneNumber pn) {
    int result = Short.compare(areaCode, pn.areaCode);
    if (result == 0) {
        result = Short.compare(prefix, pn.prefix);
        if (result == 0)
            result = Short.compare(lineNum, pn.lineNum);
    }
    return result;
}
```

In Java 8, the Comparator interface was outfitted with a set of comparator construction methods, which enable fluent construction of comparators. These comparators can then be used to implement a compareTo method, as required by the Comparable interface. Many programmers prefer the conciseness of this approach, though it does come at a modest performance cost: sorting arrays of PhoneNumber instances is about 10% slower on my machine. When using this approach, consider using Java’s static import facility so you can refer to static comparator construction methods by their simple names for clarity and brevity. Here’s how the compareTo method for PhoneNumber looks using this approach:

> 在 Java 8 中，Comparator 接口配备了一组比较器构造方法，可以流畅地构造比较器。然后可以使用这些比较器来实现 Comparator 接口所要求的 compareTo 方法。许多程序员更喜欢这种方法的简明，尽管它存在一些性能成本：在我的机器上，PhoneNumber 实例的数组排序要慢 10% 左右。在使用这种方法时，请考虑使用 Java 的静态导入功能，这样你就可以通过静态比较器构造方法的简单名称来引用它们，以获得清晰和简洁。下面是 PhoneNumber 类的 compareTo 方法改进后的样子：

```java
// Comparable with comparator construction methods
private static final Comparator<PhoneNumber> COMPARATOR = comparingInt((PhoneNumber pn) -> pn.areaCode)
    .thenComparingInt(pn -> pn.prefix)
    .thenComparingInt(pn -> pn.lineNum);

public int compareTo(PhoneNumber pn) {
    return COMPARATOR.compare(this, pn);
}
```

**译注 1：示例代码默认使用了静态导入：`import static java.util.Comparator.comparingInt;`**

**译注 2：comparingInt 及 thenComparingInt 的文档描述**

```java
static <T> Comparator<T> comparingInt(ToIntFunction<? super T> keyExtractor)

Accepts a function that extracts an int sort key from a type T, and returns a Comparator<T> that compares by that sort key.
The returned comparator is serializable if the specified function is also serializable.

接受从类型 T 中提取 int 排序 key 的函数，并返回与该排序 key 进行比较的 Comparator<T>。
如果指定的函数是可序列化的，则返回的比较器也是可序列化的。

Type Parameters:
    T - the type of element to be compared
Parameters:
    keyExtractor - the function used to extract the integer sort key
Returns:
    a comparator that compares by an extracted key
Throws:
    NullPointerException - if the argument is null
Since:
    1.8
```

```java
default Comparator<T> thenComparingInt(ToIntFunction<? super T> keyExtractor)

Returns a lexicographic-order comparator with a function that extracts a int sort key.
Implementation Requirements:
This default implementation behaves as if thenComparing(comparingInt(keyExtractor)).

返回具有提取 int 排序 key 的函数的字典顺序比较器。
实现要求：
此默认实现的行为类似于 thenComparing(comparingInt(keyExtractor))。

Parameters:
    keyExtractor - the function used to extract the integer sort key
Returns:
    a lexicographic-order comparator composed of this and then the int sort key
Throws:
    NullPointerException - if the argument is null.
Since:
    1.8
```

This implementation builds a comparator at class initialization time, using two comparator construction methods. The first is comparingInt. It is a static method that takes a key extractor function that maps an object reference to a key of type int and returns a comparator that orders instances according to that key. In the previous example, comparingInt takes a lambda () that extracts the area code from a PhoneNumber and returns a `Comparator<PhoneNumber>` that orders phone numbers according to their area codes. Note that the lambda explicitly specifies the type of its input parameter (PhoneNumber pn). It turns out that in this situation, Java’s type inference isn’t powerful enough to figure the type out for itself, so we’re forced to help it in order to make the program compile.

> 这个实现在类初始化时使用两个比较器构造方法构建一个比较器。第一个是 comparingInt。它是一个静态方法，接受一个 key 提取器函数，该函数将对象引用映射到 int 类型的 key ，并返回一个比较器，比较器根据该 key 对实例进行排序。在上述的示例中，comparingInt 使用 lambda 表达式从 PhoneNumber 中提取 areaCode，并返回 `Comparator<PhoneNumber>`，按区号来排序电话号码。注意，lambda 表达式显式地指定其输入参数的类型为 PhoneNumber。事实证明，在这种情况下，Java 的类型推断并没有强大到足以自己判断类型，因此我们不得不帮助它来编译程序。

If two phone numbers have the same area code, we need to further refine the comparison, and that’s exactly what the second comparator construction method,thenComparingInt, does. It is an instance method on Comparator that takes an int key extractor function, and returns a comparator that first applies the original comparator and then uses the extracted key to break ties. You can stack up as many calls to thenComparingInt as you like, resulting in a lexicographic ordering. In the example above, we stack up two calls to thenComparingInt, resulting in an ordering whose secondary key is the prefix and whose tertiary key is the line number. Note that we did not have to specify the parameter type of the key extractor function passed to either of the calls to thenComparingInt: Java’s type inference was smart enough to figure this one out for itself.

> 如果两个电话号码有相同的区号，我们需要进一步改进比较，这正是第二个 comparator 构造方法 thenComparingInt 所做的。它是 Comparator 上的一个实例方法，它接受一个 int 类型的 key 提取函数，并返回一个比较器，该比较器首先应用原始比较器，然后使用提取的 key 来断开连接。你可以任意堆叠对 thenComparingInt 的调用，从而形成字典顺序。在上面的例子中，我们将两个对 thenComparingInt 的调用叠加起来，得到一个排序，它的第二个 key 是 prefix，而第三个 key 是 lineNum。注意，我们不必指定传递给两个调用 thenComparingInt 的 key 提取器函数的参数类型：Java 的类型推断足够智能，可以自行解决这个问题。

The Comparator class has a full complement of construction methods.There are analogues to comparingInt and thenComparingInt for the primitive types long and double. The int versions can also be used for narrower integral types, such as short, as in our PhoneNumber example. The double versions can also be used for float. This provides coverage of all of Java’s numerical primitive types.

> Comparator 类具有完整的构造方法。对于 long 和 double 的基本类型，有类似 comparingInt 和 thenComparingInt 的方法。int 版本还可以用于范围更小的整数类型，如 PhoneNumber 示例中的 short。double 版本也可以用于 float。Comparator 类提供的构造方法覆盖了所有 Java 数值基本类型。

There are also comparator construction methods for object reference types.The static method, named comparing, has two overloadings. One takes a key extractor and uses the keys’ natural order. The second takes both a key extractor and a comparator to be used on the extracted keys. There are three overloadings of the instance method, which is named thenComparing. One overloading takes only a comparator and uses it to provide a secondary order. A second overloading takes only a key extractor and uses the key’s natural order as a secondary order. The final overloading takes both a key extractor and a comparator to be used on the extracted keys.

> 也有对象引用类型的比较器构造方法。静态方法名为 compare，它有两个重载。一个是使用 key 提取器并使用 key 的自然顺序。第二种方法同时使用 key 提取器和比较器对提取的 key 进行比较。实例方法有三种重载，称为 thenComparing。一个重载只需要一个比较器并使用它来提供一个二级顺序。第二个重载只接受一个 key 提取器，并将 key 的自然顺序用作二级顺序。最后的重载需要一个 key 提取器和一个比较器来对提取的 key 进行比较。

Occasionally you may see compareTo or compare methods that rely on the fact that the difference between two values is negative if the first value is less than the second, zero if the two values are equal, and positive if the first value is greater. Here is an example:

> 有时候，你可能会看到 compareTo 或 compare 方法，它们依赖于以下事实：如果第一个值小于第二个值，则两个值之间的差为负；如果两个值相等，则为零；如果第一个值大于零，则为正。下面是一个例子：

```java
// BROKEN difference-based comparator - violates transitivity!
static Comparator<Object> hashCodeOrder = new Comparator<>() {
    public int compare(Object o1, Object o2) {
        return o1.hashCode() - o2.hashCode();
    }
};
```

Do not use this technique. It is fraught with danger from integer overflow and IEEE 754 floating point arithmetic artifacts [JLS 15.20.1, 15.21.1]. Furthermore,the resulting methods are unlikely to be significantly faster than those written using the techniques described in this item. Use either a static compare method:

> 不要使用这种技术。它充满了来自整数溢出和 IEEE 754 浮点运算构件的危险 [JLS 15.20.1, 15.21.1]。此外，生成的方法不太可能比使用本项目中描述的技术编写的方法快得多。应使用静态比较方法：

```java
// Comparator based on static compare method
static Comparator<Object> hashCodeOrder = new Comparator<>() {
    public int compare(Object o1, Object o2) {
        return Integer.compare(o1.hashCode(), o2.hashCode());
    }
};
```

or a comparator construction method:

> 或比较器构造方法：

```java
// Comparator based on Comparator construction method
static Comparator<Object> hashCodeOrder = Comparator
    .comparingInt(o -> o.hashCode());
```

In summary, whenever you implement a value class that has a sensible ordering, you should have the class implement the Comparable interface so that its instances can be easily sorted, searched, and used in comparison-based collections. When comparing field values in the implementations of the compareTo methods, avoid the use of the < and > operators. Instead, use the static compare methods in the boxed primitive classes or the comparator construction methods in the Comparator interface.

> 总之，无论何时实现具有排序性质的值类，都应该让类实现 Comparable 接口，这样就可以轻松地对实例进行排序、搜索，并与依赖于此接口的集合实现进行互操作。在 compareTo 方法的实现中比较字段值时，避免使用 < 和 > 操作符，应使用包装类中的静态比较方法或 Comparator 接口中的 comparator 构造方法。
