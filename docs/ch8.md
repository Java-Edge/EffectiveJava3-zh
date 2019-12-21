# 第 8 章 方法

## 【49】检查参数的有效性

> Check parameters for validity

Most methods and constructors have some restrictions on what values may be passed into their parameters. For example, it is not uncommon that index values must be non-negative and object references must be non-null. You should clearly document all such restrictions and enforce them with checks at the beginning of the method body. This is a special case of the general principle that you should attempt to detect errors as soon as possible after they occur. Failing to do so makes it less likely that an error will be detected and makes it harder to determine the source of an error once it has been detected.

大多数方法和构造函数都对传递给它们的参数值有一些限制。例如，索引值必须是非负的，对象引用必须是非空的，这种情况并不少见。你应该清楚地在文档中记录所有这些限制，并在方法主体的开头使用检查来实施它们。你应该在错误发生后尽快找到它们，这是一般原则。如果不这样做，就不太可能检测到错误，而且即使检测到错误，确定错误的来源也很难。

If an invalid parameter value is passed to a method and the method checks its parameters before execution, it will fail quickly and cleanly with an appropriate exception. If the method fails to check its parameters, several things could happen. The method could fail with a confusing exception in the midst of processing. Worse, the method could return normally but silently compute the wrong result. Worst of all, the method could return normally but leave some object in a compromised state, causing an error at some unrelated point in the code at some undetermined time in the future. In other words, failure to validate parameters, can result in a violation of failure atomicity (Item 76).

如果一个无效的参数值被传递给一个方法，如果该方法在执行之前会检查它的参数，那么这个过程将迅速失败，并引发适当的异常。如果方法未能检查其参数，可能会发生以下几件事。该方法可能会在处理过程中出现令人困惑的异常而失败。更糟的是，该方法可以正常返回，但会静默计算错误的结果。最糟糕的是，该方法可以正常返回，但会使某个对象处于隐患状态，从而在将来某个不确定的时间在代码中某个不相关的位置上导致错误。换句话说，如果没有验证参数，可能会违反故障原子性（Item-76）。

For public and protected methods, use the Javadoc @throws tag to document the exception that will be thrown if a restriction on parameter values is violated (Item 74). Typically, the resulting exception will be IllegalArgumentException, IndexOutOfBoundsException, or NullPointerException (Item 72). Once you’ve documented the restrictions on a method’s parameters and you’ve documented the exceptions that will be thrown if these restrictions are violated, it is a simple matter to enforce the restrictions. Here’s a typical example:

对于公共方法和受保护的方法，如果在方法说明使用 Javadoc 的 `@throws` 标签记录异常，表明如果违反了对参数值的限制，将会引发该异常（Item-74）。通常，生成的异常将是 IllegalArgumentException、IndexOutOfBoundsException 或 NullPointerException（Item-72）。一旦你在文档中记录了方法参数上的限制，并且记录了如果违反这些限制将引发的异常，那么实施这些限制就很简单了。这里有一个典型的例子：

```java
/**
* Returns a BigInteger whose value is (this mod m). This method
* differs from the remainder method in that it always returns a
* non-negative BigInteger.
**
@param m the modulus, which must be positive
* @return this mod m
* @throws ArithmeticException if m is less than or equal to 0
*/
public BigInteger mod(BigInteger m) {
    if (m.signum() <= 0)
        throw new ArithmeticException("Modulus <= 0: " + m);
    ... // Do the computation
}
```

Note that the doc comment does not say “mod throws NullPointerException if m is null,” even though the method does exactly that, as a byproduct of invoking m.signum(). This exception is documented in the class-level doc comment for the enclosing BigInteger class. The classlevel comment applies to all parameters in all of the class’s public methods. This is a good way to avoid the clutter of documenting every NullPointerException on every method individually. It may be combined with the use of @Nullable or a similar annotation to indicate that a particular parameter may be null, but this practice is not standard, and multiple annotations are in use for this purpose.

注意，文档注释并没有说「如果 m 为空，mod 将抛出 NullPointerException」，尽管方法确实是这样做的，这是调用 `m.signum()` 的副产品。这个异常记录在类级别的文档注释中，用于包含 BigInteger 类。类级别注释适用于类的所有公共方法中的所有参数。这是避免在每个方法上分别记录每个 NullPointerException 而造成混乱的好方法。它可以与 `@Nullable` 或类似的注释结合使用，以指示某个特定参数可能为 null，但这种做法并不标准，为此使用了多个注释。

**The Objects.requireNonNull method, added in Java 7, is flexible and convenient, so there’s no reason to perform null checks manually anymore.** You can specify your own exception detail message if you wish. The method returns its input, so you can perform a null check at the same time as you use a value:

**在 Java 7 中添加的 `Objects.requireNonNull` 方法非常灵活和方便，因此不再需要手动执行空检查。** 如果愿意，可以指定自己的异常详细信息。该方法返回它的输入，所以你可以执行一个空检查，同时你使用一个值：

```java
// Inline use of Java's null-checking facility
this.strategy = Objects.requireNonNull(strategy, "strategy");
```

You can also ignore the return value and use Objects.requireNonNull as a freestanding null check where that suits your needs.

你还可以忽略返回值并使用 `Objects.requireNonNull` 作为一个独立的 null 检查来满足你的需要。

In Java 9, a range-checking facility was added to java.util.Objects. This facility consists of three methods: checkFromIndexSize, checkFromToIndex, and checkIndex. This facility is not as flexible as the null-checking method. It doesn’t let you specify your own exception detail message, and it is designed solely for use on list and array indices. It does not handle closed ranges (which contain both of their endpoints). But if it does what you need, it’s a useful convenience.

在 Java 9 中，范围检查功能被添加到 `java.util.Objects` 中。这个功能由三个方法组成：checkFromIndexSize、checkFromToIndex 和 checkIndex。这个工具不如空检查方法灵活。它不允许你指定自己的异常详细信息，而且它仅用于 List 和数组索引。它不处理封闭范围（包含两个端点）。但如果它满足你的需求，它仍是一个有用的工具。

For an unexported method, you, as the package author, control the circumstances under which the method is called, so you can and should ensure that only valid parameter values are ever passed in. Therefore, nonpublic methods can check their parameters using assertions, as shown below:

对于未导出的方法，作为包的作者，你应该定制方法调用的环境，因此你可以并且应该确保只传递有效的参数值。因此，非公共方法可以使用断言检查它们的参数，如下所示：

```java
// Private helper function for a recursive sort
private static void sort(long a[], int offset, int length) {
    assert a != null;
    assert offset >= 0 && offset <= a.length;
    assert length >= 0 && length <= a.length - offset;
    ... // Do the computation
}
```

In essence, these assertions are claims that the asserted condition will be true, regardless of how the enclosing package is used by its clients. Unlike normal validity checks, assertions throw AssertionError if they fail. And unlike normal validity checks, they have no effect and essentially no cost unless you enable them, which you do by passing the -ea (or -enableassertions) flag to the java command. For more information on assertions, see the tutorial [Asserts].

从本质上说，这些断言在声明时，条件将为 true，而不管其客户端如何使用所包含的包。与普通的有效性检查不同，如果断言失败，则会抛出 AssertionError。与普通的有效性检查不同，如果断言没有起到作用，本质上不存在成本，除非你启用它们，你可以通过将 `-ea`（ 或 `-enableassertion`）标志传递给 java 命令来启用它们。有关断言的更多信息，请参见教程 [Asserts]。

It is particularly important to check the validity of parameters that are not used by a method, but stored for later use. For example, consider the static factory method on page 101, which takes an int array and returns a List view of the array. If a client were to pass in null, the method would throw a NullPointerException because the method has an explicit check (the call to Objects.requireNonNull). Had the check been omitted, the method would return a reference to a newly created List instance that would throw a NullPointerException as soon as a client attempted to use it. By that time, the origin of the List instance might be difficult to determine, which could greatly complicate the task of debugging.

特别重要的是，应检查那些不是由方法使用，而是存储起来供以后使用的参数的有效性。例如，考虑第 101 页中的静态工厂方法，它接受一个 int 数组并返回数组的 List 视图。如果客户端传入 null，该方法将抛出 NullPointerException，因为该方法具有显式检查(调用 `Objects.requireNonNull`)。如果省略了检查，该方法将返回对新创建的 List 实例的引用，该实例将在客户端试图使用它时抛出 NullPointerException。到那时，List 实例的起源可能很难确定，这可能会使调试任务变得非常复杂。

Constructors represent a special case of the principle that you should check the validity of parameters that are to be stored away for later use. It is critical to check the validity of constructor parameters to prevent the construction of an object that violates its class invariants.

构造函数代表了一种特殊的情况，即，你应该检查要存储起来供以后使用的参数的有效性。检查构造函数参数的有效性对于防止构造生成实例对象时，违背类的对象的不变性非常重要。

There are exceptions to the rule that you should explicitly check a method’s parameters before performing its computation. An important exception is the case in which the validity check would be expensive or impractical and the check is performed implicitly in the process of doing the computation. For example, consider a method that sorts a list of objects, such as Collections.sort(List). All of the objects in the list must be mutually comparable. In the process of sorting the list, every object in the list will be compared to some other object in the list. If the objects aren’t mutually comparable, one of these comparisons will throw a ClassCastException, which is exactly what the sort method should do. Therefore, there would be little point in checking ahead of time that the elements in the list were mutually comparable. Note, however, that indiscriminate reliance on implicit validity checks can result in the loss of failure atomicity (Item 76).

在执行方法的计算任务之前，应该显式地检查方法的参数，这条规则也有例外。一个重要的例外是有效性检查成本较高或不切实际，或者检查是在计算过程中隐式执行了。例如，考虑一个为对象 List 排序的方法，比如 `Collections.sort(List)`。List 中的所有对象必须相互比较。在对 List 排序的过程中，List 中的每个对象都会与列表中的其他对象进行比较。如果对象不能相互比较，将抛出 ClassCastException，这正是 sort 方法应该做的。因此，没有必要预先检查列表中的元素是否具有可比性。但是，请注意，不加区别地依赖隐式有效性检查可能导致失败原子性的丢失（Item-76）。

Occasionally, a computation implicitly performs a required validity check but throws the wrong exception if the check fails. In other words, the exception that the computation would naturally throw as the result of an invalid parameter value doesn’t match the exception that the method is documented to throw. Under these circumstances, you should use the exception translation idiom, described in Item 73, to translate the natural exception into the correct one.

有时，计算任务会隐式地执行所需的有效性检查，但如果检查失败，则抛出错误的异常。换句话说，计算任务由于无效参数值抛出的异常，与文档中记录的方法要抛出的异常不匹配。在这种情况下，你应该使用 Item-73 中描述的异常转译技术来将计算任务抛出的异常转换为正确的异常。

Do not infer from this item that arbitrary restrictions on parameters are a good thing. On the contrary, you should design methods to be as general as it is practical to make them. The fewer restrictions that you place on parameters, the better, assuming the method can do something reasonable with all of the parameter values that it accepts. Often, however, some restrictions are intrinsic to the abstraction being implemented.

不要从本条目推断出：对参数的任意限制都是一件好事。相反，你应该把方法设计得既通用又实用。对参数施加的限制越少越好，假设该方法可以对它所接受的所有参数值进行合理的处理。然而，一些限制常常是实现抽象的内在限制。

To summarize, each time you write a method or constructor, you should think about what restrictions exist on its parameters. You should document these restrictions and enforce them with explicit checks at the beginning of the method body. It is important to get into the habit of doing this. The modest work that it entails will be paid back with interest the first time a validity check fails.

总而言之，每次编写方法或构造函数时，都应该考虑参数存在哪些限制。你应该在文档中记录这些限制，并在方法主体的开头显式地检查。养成这样的习惯是很重要的。它所涉及的这一少量工作及其所花费的时间，将在有效性检查出现第一次失败时连本带利地偿还。

---

## 【50】在需要时制作防御性副本

> Make defensive copies when needed

One thing that makes Java a pleasure to use is that it is a safe language. This means that in the absence of native methods it is immune to buffer overruns, array overruns, wild pointers, and other memory corruption errors that plague unsafe languages such as C and C++. In a safe language, it is possible to write classes and to know with certainty that their invariants will hold, no matter what happens in any other part of the system. This is not possible in languages that treat all of memory as one giant array.

Java 是一种安全的语言，这是它的一大优点。这意味着在没有本地方法的情况下，它不受缓冲区溢出、数组溢出、非法指针和其他内存损坏错误的影响，这些错误困扰着 C 和 c++ 等不安全语言。在一种安全的语言中，可以编写一个类并确定它们的不变量将保持不变，而不管在系统的任何其他部分发生了什么。在将所有内存视为一个巨大数组的语言中，这是不可能的。

Even in a safe language, you aren’t insulated from other classes without some effort on your part. **You must program defensively, with the assumption that clients of your class will do their best to destroy its invariants.** This is increasingly true as people try harder to break the security of systems, but more commonly, your class will have to cope with unexpected behavior resulting from the honest mistakes of well-intentioned programmers. Either way, it is worth taking the time to write classes that are robust in the face of ill-behaved clients.

即使使用一种安全的语言，如果你不付出一些努力，也无法与其他类隔离。**你必须进行防御性的设计，并假定你的类的客户端会尽最大努力破坏它的不变量。** 随着人们越来越多地尝试破坏系统的安全性，这个观点越来越正确，但更常见的情况是，你的类将不得不处理程序员的无意错误所导致的意外行为。无论哪种方式，都值得花时间编写一个健壮的类来面对行为不轨的客户端。

While it is impossible for another class to modify an object’s internal state without some assistance from the object, it is surprisingly easy to provide such assistance without meaning to do so. For example, consider the following class, which purports to represent an immutable time period:

虽然如果没有对象的帮助，另一个类是不可能修改对象的内部状态的，但是要提供这样的帮助却出奇地容易。例如，考虑下面的类，它表示一个不可变的时间段：

```java
// Broken "immutable" time period class
public final class Period {
    private final Date start;
    private final Date end;

    /**
    * @param start the beginning of the period
    * @param end the end of the period; must not precede start
    * @throws IllegalArgumentException if start is after end
    * @throws NullPointerException if start or end is null
    */
    public Period(Date start, Date end) {
        if (start.compareTo(end) > 0)
            throw new IllegalArgumentException(start + " after " + end);
        this.start = start;
        this.end = end;
    }

    public Date start() {
        return start;
    }

    public Date end() {
        return end;
    }
    ... // Remainder omitted
}
```

At first glance, this class may appear to be immutable and to enforce the invariant that the start of a period does not follow its end. It is, however, easy to violate this invariant by exploiting the fact that Date is mutable:

乍一看，这个类似乎是不可变的，并且要求一个时间段的开始时间不能在结束时间之后。然而，利用 Date 是可变的这一事实很容易绕过这个约束：

```java
// Attack the internals of a Period instance
Date start = new Date();
Date end = new Date();
Period p = new Period(start, end);
end.setYear(78); // Modifies internals of p!
```

As of Java 8, the obvious way to fix this problem is to use Instant (or Local-DateTime or ZonedDateTime) in place of a Date because Instant (and the other java.time classes) are immutable (Item 17). **Date is obsolete and should no longer be used in new code.** That said, the problem still exists: there are times when you’ll have to use mutable value types in your APIs and internal representations, and the techniques discussed in this item are appropriate for those times.

从 Java 8 开始，解决这个问题的典型方法就是使用 Instant（或 Local-DateTime 或 ZonedDateTime）来代替 Date，因为 Instant（和其他时间类）类是不可变的（Item-17）。**Date 已过时，不应在新代码中使用。** 尽管如此，问题仍然存在：有时你必须在 API 和内部表示中使用可变值类型，本项目中讨论的技术适用于这些情形。

To protect the internals of a Period instance from this sort of attack, **it is essential to make a defensive copy of each mutable parameter to the constructor** and to use the copies as components of the Period instance in place of the originals:

为了保护 Period 实例的内部不受此类攻击，**必须将每个可变参数的防御性副本复制给构造函数**，并将副本用作 Period 实例的组件，而不是原始组件：

```java
// Repaired constructor - makes defensive copies of parameters
public Period(Date start, Date end) {
    this.start = new Date(start.getTime());
    this.end = new Date(end.getTime());
    if (this.start.compareTo(this.end) > 0)
        throw new IllegalArgumentException(this.start + " after " + this.end);
}
```

With the new constructor in place, the previous attack will have no effect on the Period instance. Note that **defensive copies are made before checking the validity of the parameters (Item 49), and the validity check is performed on the copies rather than on the originals.** While this may seem unnatural, it is necessary. It protects the class against changes to the parameters from another thread during the window of vulnerability between the time the parameters are checked and the time they are copied. In the computer security community, this is known as a time-of-check/time-of-use or TOCTOU attack [Viega01].

有了新的构造函数，之前的攻击将不会对 Period 实例产生影响。注意，**防御性副本是在检查参数的有效性之前制作的（Item-49），有效性检查是在副本上而不是在正本上执行的。** 虽然这看起来不自然，但却是必要的。在检查参数和复制参数之间的空窗期，它保护类不受来自其他线程的参数更改的影响。在计算机安全社区里，这被称为 time-of-check/time-of-use 或 TOCTOU 攻击 [Viega01]。

Note also that we did not use Date’s clone method to make the defensive copies. Because Date is nonfinal, the clone method is not guaranteed to return an object whose class is java.util.Date: it could return an instance of an untrusted subclass that is specifically designed for malicious mischief. Such a subclass could, for example, record a reference to each instance in a private static list at the time of its creation and allow the attacker to access this list. This would give the attacker free rein over all instances. To prevent this sort of attack, **do not use the clone method to make a defensive copy of a parameter whose type is subclassable by untrusted parties.**

还要注意，我们没有使用 Date 的 clone 方法来创建防御性副本。因为 Date 不是 final 的，所以不能保证 clone 方法返回一个 java.util.Date 的实例对象：它可以返回一个不受信任子类的实例，这个子类是专门为恶意破坏而设计的。例如，这样的子类可以在创建时在私有静态列表中记录对每个实例的引用，并允许攻击者访问这个列表。这将使攻击者可以自由控制所有实例。为防止此类攻击，**对可被不受信任方子类化的参数类型，不要使用 clone 方法进行防御性复制。**

While the replacement constructor successfully defends against the previous attack, it is still possible to mutate a Period instance, because its accessors offer access to its mutable internals:

虽然替换构造函数成功地防御了之前的攻击，但是仍然可以修改 Period 实例，因为它的访问器提供了对其可变内部结构的访问：

```java
// Second attack on the internals of a Period instance
Date start = new Date();
Date end = new Date();
Period p = new Period(start, end);
p.end().setYear(78); // Modifies internals of p!
```

To defend against the second attack, merely modify the accessors to return defensive copies of mutable internal fields:

要防御第二次攻击，只需修改访问器，返回可变内部字段的防御副本：

```java
// Repaired accessors - make defensive copies of internal fields
public Date start() {
    return new Date(start.getTime());
}

public Date end() {
    return new Date(end.getTime());
}
```

With the new constructor and the new accessors in place, Period is truly immutable. No matter how malicious or incompetent a programmer, there is simply no way to violate the invariant that the start of a period does not follow its end (without resorting to extralinguistic means such as native methods and reflection). This is true because there is no way for any class other than Period itself to gain access to either of the mutable fields in a Period instance. These fields are truly encapsulated within the object.

有了新的构造函数和新的访问器，Period 实际上是不可变的。无论程序员多么恶毒或无能，都不可能违背一个时间段的开始时间不能在结束时间之后这一不变条件（除非使用诸如本地方法和反射之类的外部语言手段）。这是真的，因为除了 Period 本身之外，任何类都无法访问 Period 实例中的任何可变字段。这些字段真正封装在对象中。

In the accessors, unlike the constructor, it would be permissible to use the clone method to make the defensive copies. This is so because we know that the class of Period’s internal Date objects is java.util.Date, and not some untrusted subclass. That said, you are generally better off using a constructor or static factory to copy an instance, for reasons outlined in Item 13.

在访问器中，与构造函数不同，可以使用 clone 方法进行防御性复制。这是因为我们知道 Period 的内部 Date 对象的类是 `java.util.Date`，而不是某个不可信的子类。也就是说，基于 Item-13 中列出的原因，一般情况下，最好使用构造函数或静态工厂来复制实例。

Defensive copying of parameters is not just for immutable classes. Any time you write a method or constructor that stores a reference to a client-provided object in an internal data structure, think about whether the client-provided object is potentially mutable. If it is, think about whether your class could tolerate a change in the object after it was entered into the data structure. If the answer is no, you must defensively copy the object and enter the copy into the data structure in place of the original. For example, if you are considering using a client-provided object reference as an element in an internal Set instance or as a key in an internal Map instance, you should be aware that the invariants of the set or map would be corrupted if the object were modified after it is inserted.

参数的防御性复制不仅适用于不可变类。在编写方法或构造函数时，如果要在内部数据结构中存储对客户端提供的对象的引用，请考虑客户端提供的对象是否可能是可变的。如果是，请考虑该对象进入数据结构之后，你的类是否能够容忍该对象发生更改。如果答案是否定的，则必须防御性地复制对象，并将副本输入到数据结构中，而不是原始正本。举个例子，如果你正在考虑使用由客户提供的对象引用作为内部 Set 实例的元素，或者作为内部 Map 实例的键, 就应该意识到如果这个对象在插入之后发生改变，Set 或者 Map 的约束条件就会遭到破坏。

The same is true for defensive copying of internal components prior to returning them to clients. Whether or not your class is immutable, you should think twice before returning a reference to an internal component that is mutable. Chances are, you should return a defensive copy. Remember that nonzero-length arrays are always mutable. Therefore, you should always make a defensive copy of an internal array before returning it to a client. Alternatively, you could return an immutable view of the array. Both of these techniques are shown in Item 15.

在将内部组件返回给客户端之前应对其进行防御性复制也是如此。无论你的类是否是不可变的，在返回对可变内部组件的引用之前，你都应该三思。很有可能，你应该返回一个防御性副本。记住，非零长度数组总是可变的。因此，在将内部数组返回给客户端之前，应该始终创建一个防御性的副本。或者，你可以返回数组的不可变视图。这两种技术都已经在 Item-15 中演示过。

Arguably, the real lesson in all of this is that you should, where possible, use immutable objects as components of your objects so that you that don’t have to worry about defensive copying (Item 17). In the case of our Period example, use Instant (or LocalDateTime or ZonedDateTime), unless you’re using a release prior to Java 8. If you are using an earlier release, one option is to store the primitive long returned by Date.getTime() in place of a Date reference.

可以说，所有这些教训体现了，在可能的情况下，应该使用不可变对象作为对象的组件，这样就不必操心防御性复制（Item-17）。在我们的 Period 示例中，使用 Instant（或 LocalDateTime 或 ZonedDateTime），除非你使用的是 Java 8 之前的版本。如果使用较早的版本，一个选项是存储 `Date.getTime()` 返回的 long 基本数据类型，而不是 Date 引用。

There may be a performance penalty associated with defensive copying and it isn’t always justified. If a class trusts its caller not to modify an internal component, perhaps because the class and its client are both part of the same package, then it may be appropriate to dispense with defensive copying. Under these circumstances, the class documentation should make it clear that the caller must not modify the affected parameters or return values.

防御性复制可能会带来性能损失，而且并不总是合理的。如果一个类信任它的调用者不会去修改内部组件，可能是因为类和它的客户端都是同一个包的一部分，那么就应该避免防御性复制。在这种情况下，类文档应该表明调用者不能修改受影响的参数或返回值。

Even across package boundaries, it is not always appropriate to make a defensive copy of a mutable parameter before integrating it into an object. There are some methods and constructors whose invocation indicates an explicit handoff of the object referenced by a parameter. When invoking such a method, the client promises that it will no longer modify the object directly. A method or constructor that expects to take ownership of a client-provided mutable object must make this clear in its documentation.

即使跨越包边界，在将可变参数集成到对象之前对其进行防御性复制也并不总是合适的。有一些方法和构造函数，它们的调用要求参数引用的对象要进行显式切换。当调用这样一个方法时，客户端承诺不再直接修改对象。希望拥有客户端提供的可变对象所有权的方法或构造函数必须在其文档中明确说明这一点。

Classes containing methods or constructors whose invocation indicates a transfer of control cannot defend themselves against malicious clients. Such classes are acceptable only when there is mutual trust between a class and its client or when damage to the class’s invariants would harm no one but the client. An example of the latter situation is the wrapper class pattern (Item 18). Depending on the nature of the wrapper class, the client could destroy the class’s invariants by directly accessing an object after it has been wrapped, but this typically would harm only the client.

包含方法或构造函数的类，如果其方法或构造函数的调用需要移交对象的控制权，就不能保护自己免受恶意客户端的攻击。只有当一个类和它的客户端之间相互信任，或者对类的不变量的破坏只会对客户端造成伤害时，这样的类才是可接受的。后一种情况的一个例子是包装类模式（Item-18）。根据包装类的性质，客户端可以在包装对象之后直接访问对象，从而破坏类的不变量，但这通常只会损害客户端。

In summary, if a class has mutable components that it gets from or returns to its clients, the class must defensively copy these components. If the cost of the copy would be prohibitive and the class trusts its clients not to modify the components inappropriately, then the defensive copy may be replaced by documentation outlining the client’s responsibility not to modify the affected components.

总而言之，如果一个类具有从客户端获取或返回给客户端的可变组件，则该类必须防御性地复制这些组件。如果复制的成本过高，并且类信任它的客户端不会不适当地修改组件，那么可以不进行防御性的复制，取而代之的是在文档中指明客户端的职责是不得修改受到影响的组件。

---

## 【51】仔细设计方法签名

> Design method signatures carefully

This item is a grab bag of API design hints that don’t quite deserve items of their own. Taken together, they’ll help make your API easier to learn and use and less prone to errors.

本条目是一个 API 设计提示的大杂烩，它们还不完全值得拥有独立的条目。总之，它们将帮助你使 API 更容易学习和使用，并且更不容易出错。

**Choose method names carefully.** Names should always obey the standard naming conventions (Item 68). Your primary goal should be to choose names that are understandable and consistent with other names in the same package. Your secondary goal should be to choose names consistent with the broader consensus, where it exists. Avoid long method names. When in doubt, look to the Java library APIs for guidance. While there are plenty of inconsistencies— inevitable, given the size and scope of these libraries—there is also a fair amount of consensus.

**仔细选择方法名称。** 名称应始终遵守标准的命名约定（Item-68）。你的主要目标应该是选择可理解的、与同一包中的其他名称风格一致的名称。你的第二个目标应该是选择被广泛认可的名字。避免长方法名。如果有疑问，可以参考 Java 库 API，尽管其中也存在大量的矛盾（考虑到这些库的规模和范围，这是不可避免的）但也达成了相当多的共识。

**Don’t go overboard in providing convenience methods.** Every method should “pull its weight.” Too many methods make a class difficult to learn, use, document, test, and maintain. This is doubly true for interfaces, where too many methods complicate life for implementors as well as users. For each action supported by your class or interface, provide a fully functional method. Consider providing a “shorthand” only if it will be used often. **When in doubt, leave it out.**

**不要提供过于便利的方法。** 每种方法都应该各司其职。太多的方法使得类难以学习、使用、记录、测试和维护。对于接口来说更是如此，在接口中，太多的方法使实现者和用户的工作变得复杂。对于类或接口支持的每个操作，请提供一个功能齐全的方法。只有在经常使用时才考虑提供便捷方式。**但如果有疑问，就不要提供。**

**Avoid long parameter lists.** Aim for four parameters or fewer. Most programmers can’t remember longer parameter lists. If many of your methods exceed this limit, your API won’t be usable without constant reference to its documentation. Modern IDEs help, but you are still much better off with short parameter lists. **Long sequences of identically typed parameters are especially harmful**. Not only won’t users be able to remember the order of the parameters, but when they transpose parameters accidentally, their programs will still compile and run. They just won’t do what their authors intended.

**避免长参数列表。** 设定四个或更少的参数。大多数程序员记不住更长的参数列表。如果你的许多方法超过了这个限制，而用户没有对文档的不断查看，你的 API 将无法使用。现代 IDE 会有所帮助，但是使用简短的参数列表仍然会让情况好得多。**长序列的同类型参数尤其有害**。用户不仅不能记住参数的顺序，而且当他们不小心转置参数时，他们的程序仍然会编译和运行。它们只是不会按照作者的意图去做。

There are three techniques for shortening overly long parameter lists. One is to break the method up into multiple methods, each of which requires only a subset of the parameters. If done carelessly, this can lead to too many methods, but it can also help reduce the method count by increasing orthogonality. For example, consider the java.util.List interface. It does not provide methods to find the first or last index of an element in a sublist, both of which would require three parameters. Instead it provides the subList method, which takes two parameters and returns a view of a sublist. This method can be combined with the indexOf or lastIndexOf method, each of which has a single parameter, to yield the desired functionality. Moreover, the subList method can be combined with any method that operates on a List instance to perform arbitrary computations on sublists. The resulting API has a very high power-to-weight ratio.

有三种方法可以缩短过长的参数列表。一种方法是将方法分解为多个方法，每个方法只需要参数的一个子集。如果操作不当，这可能导致产生太多的方法，但它也可以通过增加正交性来帮助减少方法数量。例如，考虑 `java.util.List` 接口。它不提供查找子列表中元素的第一个或最后一个索引的方法，这两个方法都需要三个参数。相反，它提供了 subList 方法，该方法接受两个参数并返回子列表的视图。此方法可以与 indexOf 或 lastIndexOf 方法组合使用以达到所需的功能，其中每个方法都有一个参数。此外，subList 方法可以与操作 List 实例的任何方法组合使用，以执行子列表上的任意操作。这样的 API 就具有非常高的 power-to-weight 比。

A second technique for shortening long parameter lists is to create helper classes to hold groups of parameters. Typically these helper classes are static member classes (Item 24). This technique is recommended if a frequently occurring sequence of parameters is seen to represent some distinct entity. For example, suppose you are writing a class representing a card game, and you find yourself constantly passing a sequence of two parameters representing a card’s rank and its suit. Your API, as well as the internals of your class, would probably benefit if you added a helper class to represent a card and replaced every occurrence of the parameter sequence with a single parameter of the helper class.

缩短长参数列表的第二种技术是创建 helper 类来保存参数组。通常，这些 helper 类是静态成员类（Item-42）。如果经常出现的参数序列表示一些不同的实体，则推荐使用这种技术。例如，假设你正在编写一个表示纸牌游戏的类，你发现会不断地传递一个序列，其中包含两个参数，分别表示纸牌的等级和花色。如果你添加一个 helper 类来表示一张卡片，并用 helper 类的一个参数替换参数序列中的每个出现的参数，那么你的 API 以及类的内部结构都可能受益。

A third technique that combines aspects of the first two is to adapt the Builder pattern (Item 2) from object construction to method invocation. If you have a method with many parameters, especially if some of them are optional, it can be beneficial to define an object that represents all of the parameters and to allow the client to make multiple “setter” calls on this object, each of which sets a single parameter or a small, related group. Once the desired parameters have been set, the client invokes the object’s “execute” method, which does any final validity checks on the parameters and performs the actual computation.

结合前两个方面讨论的第三种技术是，从对象构建到方法调用都采用建造者模式（Item-2）。如果你有一个方法带有许多参数，特别是其中一些参数是可选的，最好定义一个对象来表示所有参数，并允许客户端多次调用「setter」来使用这个对象，每一次都设置一个参数或较小相关的组。一旦设置了所需的参数，客户机就调用对象的「execute」方法，该方法对参数进行最终有效性检查并执行实际操作。

**For parameter types, favor interfaces over classes** (Item 64). If there is an appropriate interface to define a parameter, use it in favor of a class that implements the interface. For example, there is no reason to ever write a method that takes HashMap on input—use Map instead. This lets you pass in a HashMap, a TreeMap, a ConcurrentHashMap, a submap of a TreeMap, or any Map implementation yet to be written. By using a class instead of an interface, you restrict your client to a particular implementation and force an unnecessary and potentially expensive copy operation if the input data happens to exist in some other form.

**对于参数类型，优先选择接口而不是类**（Item-64）。如果有合适的接口来定义参数，那么使用它来支持实现该接口的类。例如，没有理由编写一个输入使用 HashMap 的方法，而应该使用 Map。这允许你传入 HashMap、TreeMap、ConcurrentHashMap、TreeMap 的子映射或任何尚未编写的 Map 实现。通过使用类而不是接口，你可以将客户端限制在特定的实现中，如果输入数据碰巧以某种其他形式存在，则会强制执行不必要的、可能代价很高的复制操作。

**Prefer two-element enum types to boolean parameters,** unless the meaning of the boolean is clear from the method name. Enums make your code easier to read and to write. Also, they make it easy to add more options later. For example, you might have a Thermometer type with a static factory that takes this enum:

**双元素枚举类型优于 boolean 参数，** 除非布尔值的含义在方法名中明确。枚举使代码更容易读和写。此外，它们使以后添加更多选项变得更加容易。例如，你可能有一个 Thermometer 类型与静态工厂，采用枚举：

```java
public enum TemperatureScale { FAHRENHEIT, CELSIUS }
```

Not only does Thermometer.newInstance(TemperatureScale.CELSIUS) make a lot more sense than Thermometer.newInstance(true), but you can add KELVIN to TemperatureScale in a future release without having to add a new static factory to Thermometer. Also, you can refactor temperaturescale dependencies into methods on the enum constants (Item 34). For example, each scale constant could have a method that took a double value and converted it to Celsius.

`Thermometer.newInstance(TemperatureScale.CELSIUS)` 不仅比 `Thermometer.newInstance(true)` 更有意义，而且你可以在将来的版本中向 TemperatureScale 添加 KELVIN，而不必向 Thermometer 添加新的静态工厂。此外，你还可以将 TemperatureScale 依赖项重构为 enum 常量（Item-34）上的方法。例如，每个刻度单位都有一个方法，该方法带有 double 值并将其转换为摄氏度。

---

## 【52】明智地使用重载

> Use overloading judiciously

The following program is a well-intentioned attempt to classify collections according to whether they are sets, lists, or some other kind of collection:

下面的程序是一个善意的尝试，根据一个 Collection 是 Set、List 还是其他的集合类型来进行分类：

```java
// Broken! - What does this program print?
public class CollectionClassifier {
    public static String classify(Set<?> s) {
        return "Set";
    }

    public static String classify(List<?> lst) {
        return "List";
    }

    public static String classify(Collection<?> c) {
        return "Unknown Collection";
    }

    public static void main(String[] args) {
        Collection<?>[] collections = {
            new HashSet<String>(),new ArrayList<BigInteger>(),new HashMap<String, String>().values()
        };
        for (Collection<?> c : collections)
            System.out.println(classify(c));
    }
}
```

You might expect this program to print Set, followed by List and Unknown Collection, but it doesn’t. It prints Unknown Collection three times. Why does this happen? Because the classify method is overloaded, and **the choice of which overloading to invoke is made at compile time.** For all three iterations of the loop, the compile-time type of the parameter is the same: `Collection<?>`. The runtime type is different in each iteration, but this does not affect the choice of overloading. Because the compile-time type of the parameter is `Collection<?>`, the only applicable overloading is the third one, `classify(Collection<?>)`, and this overloading is invoked in each iteration of the loop.

你可能期望这个程序打印 Set，然后是 List 和 Unknown Collection，但是它没有这样做。它打印 Unknown Collection 三次。为什么会这样？因为 classify 方法被重载，并且 **在编译时就决定了要调用哪个重载。** 对于循环的三个迭代过程，参数的编译时类型是相同的：`Collection<?>`。运行时类型在每个迭代中是不同的，但这并不影响重载的选择。因为参数的编译时类型是 `Collection<?>`，唯一适用的重载是第三个，`classify(Collection<?>)`，这个重载在循环的每个迭代过程中都会调用。

The behavior of this program is counterintuitive because **selection among overloaded methods is static, while selection among overridden methods is dynamic.** The correct version of an overridden method is chosen at runtime, based on the runtime type of the object on which the method is invoked. As a reminder, a method is overridden when a subclass contains a method declaration with the same signature as a method declaration in an ancestor. If an instance method is overridden in a subclass and this method is invoked on an instance of the subclass, the subclass’s overriding method executes, regardless of the compile-time type of the subclass instance. To make this concrete, consider the following program:

这个程序的行为违反常规，因为 **重载方法的选择是静态的，而覆盖法的选择是动态的。** 在运行时根据调用方法的对象的运行时类型选择覆盖方法的正确版本。提醒一下，当子类包含与祖先中的方法声明具有相同签名的方法声明时，方法将被覆盖。如果在子类中覆盖实例方法，并且在子类的实例上调用此方法，则执行子类的覆盖方法，而不管子类实例的编译时类型如何。为了更具体的说明，考虑以下程序:

```java
class Wine {
    String name() { return "wine"; }
}

class SparklingWine extends Wine {
    @Override
    String name() { return "sparkling wine"; }
}

class Champagne extends SparklingWine {
    @Override
    String name() { return "champagne"; }
}

public class Overriding {
    public static void main(String[] args) {
        List<Wine> wineList = List.of(new Wine(), new SparklingWine(), new Champagne());
    for (Wine wine : wineList)
        System.out.println(wine.name());
    }
}
```

The name method is declared in class Wine and overridden in subclasses SparklingWine and Champagne. As you would expect, this program prints out wine, sparkling wine, and champagne, even though the compiletime type of the instance is Wine in each iteration of the loop. The compile-time type of an object has no effect on which method is executed when an overridden method is invoked; the “most specific” overriding method always gets executed. Compare this to overloading, where the runtime type of an object has no effect on which overloading is executed; the selection is made at compile time, based entirely on the compile-time types of the parameters.

name 方法在 Wine 类中声明，并在 SparklingWine 和 Champagne 子类中重写。正如你所期望的，这个程序打印出 wine、sparkling 和 champagne，即使实例的编译时类型是循环每次迭代中的 wine。对象的编译时类型对调用覆盖方法时执行的方法没有影响；「最特定的」覆盖方法总是被执行。将此与重载进行比较，在重载中，对象的运行时类型对执行重载没有影响；选择是在编译时进行的，完全基于参数的编译时类型。

In the CollectionClassifier example, the intent of the program was to discern the type of the parameter by dispatching automatically to the appropriate method overloading based on the runtime type of the parameter, just as the name method did in the Wine example. Method overloading simply does not provide this functionality. Assuming a static method is required, the best way to fix the CollectionClassifier program is to replace all three overloadings of classify with a single method that does explicit instanceof tests:

在 CollectionClassifier 示例中，程序的目的是通过根据参数的运行时类型自动分派到适当的方法重载来识别参数的类型，就像 Wine 示例中的 name 方法所做的那样。方法重载不提供此功能。假设需要一个静态方法，修复 CollectionClassifier 程序的最佳方法是用一个执行显式 instanceof 测试的方法替换 classification 的所有三个重载：

```java
public static String classify(Collection<?> c) {
    return c instanceof Set ? "Set" :c instanceof List ? "List" : "Unknown Collection";
}
```

Because overriding is the norm and overloading is the exception, overriding sets people’s expectations for the behavior of method invocation. As demonstrated by the CollectionClassifier example, overloading can easily confound these expectations. It is bad practice to write code whose behavior is likely to confuse programmers. This is especially true for APIs. If the typical user of an API does not know which of several method overloadings will get invoked for a given set of parameters, use of the API is likely to result in errors. These errors will likely manifest themselves as erratic behavior at runtime, and many programmers will have a hard time diagnosing them. Therefore you should **avoid confusing uses of overloading.**

因为覆盖是规范，而重载是例外，所以覆盖满足了人们对方法调用行为的期望。正如 CollectionClassifier 示例所示，重载很容易混淆这些期望。编写可能使程序员感到困惑的代码是不好的行为。对于 API 尤其如此。如果 API 的用户不知道一组参数应该调用哪一种方法重载，那么使用 API 时很可能会导致错误。这些错误很可能在运行时表现为不稳定的行为，许多程序员将很难诊断它们。因此，**应该避免混淆重载的用法。**

Exactly what constitutes a confusing use of overloading is open to some debate. **A safe, conservative policy is never to export two overloadings with the same number of parameters.** If a method uses varargs, a conservative policy is not to overload it at all, except as described in Item 53. If you adhere to these restrictions, programmers will never be in doubt as to which overloading applies to any set of actual parameters. These restrictions are not terribly onerous because **you can always give methods different names instead of overloading them.**

究竟是什么构成了混淆重载的用法还有待商榷。**安全、保守的策略是永远不导出具有相同数量参数的两个重载。** 如果一个方法使用了可变参数，保守策略是根本不重载它，除非如 Item-53 所述。如果遵守这些限制，程序员就不会怀疑一组参数应该调用哪一种方法重载。这些限制并不十分繁琐，因为 **你总是可以为方法提供不同的名称，而不是重载它们。**

For example, consider the ObjectOutputStream class. It has a variant of its write method for every primitive type and for several reference types. Rather than overloading the write method, these variants all have different names, such as writeBoolean(boolean), writeInt(int), and writeLong(long). An added benefit of this naming pattern, when compared to overloading, is that it is possible to provide read methods with corresponding names, for example, readBoolean(), readInt(), and readLong(). The ObjectInputStream class does, in fact, provide such read methods.

例如，考虑 ObjectOutputStream 类。对于每个基本类型和几种引用类型，其 write 方法都有变体。这些变体都有不同的名称，而不是重载 write 方法，例如 `writeBoolean(boolean)`、`writeInt(int)` 和 `writeLong(long)`。与重载相比，这种命名模式的另一个好处是，可以为 read 方法提供相应的名称，例如 `readBoolean()`、`readInt()` 和 `readLong()`。ObjectInputStream 类实际上也提供了这样的读方法。

For constructors, you don’t have the option of using different names: multiple constructors for a class are always overloaded. You do, in many cases, have the option of exporting static factories instead of constructors (Item 1). Also, with constructors you don’t have to worry about interactions between overloading and overriding, because constructors can’t be overridden. You will probably have occasion to export multiple constructors with the same number of parameters, so it pays to know how to do it safely.

对于构造函数，你没有使用不同名称的机会：一个类的多个构造函数只能重载。在很多情况下，你可以选择导出静态工厂而不是构造函数（Item-1）。你可能会有机会导出具有相同数量参数的多个构造函数，因此知道如何安全地执行是有必要的。

Exporting multiple overloadings with the same number of parameters is unlikely to confuse programmers if it is always clear which overloading will apply to any given set of actual parameters. This is the case when at least one corresponding formal parameter in each pair of overloadings has a “radically different” type in the two overloadings. Two types are radically different if it is clearly impossible to cast any non-null expression to both types. Under these circumstances, which overloading applies to a given set of actual parameters is fully determined by the runtime types of the parameters and cannot be affected by their compile-time types, so a major source of confusion goes away. For example, ArrayList has one constructor that takes an int and a second constructor that takes a Collection. It is hard to imagine any confusion over which of these two constructors will be invoked under any circumstances.

如果总是清楚一组参数应该调用哪一种方法重载，那么用相同数量的参数导出多个重载不太可能让程序员感到困惑。在这种情况下，每对重载中至少有一个对应的形式参数在这两个重载中具有「完全不同的」类型。如果不可能将任何非空表达式强制转换为这两种类型，那么这两种类型是完全不同的。在这些情况下，应用于给定实际参数集的重载完全由参数的运行时类型决定，且不受其编译时类型的影响，因此消除了一个主要的混淆源。例如，ArrayList 有一个接受 int 的构造函数和第二个接受 Collection 的构造函数。很难想象在什么情况下会不知道这两个构造函数中哪个会被调用。

Prior to Java 5, all primitive types were radically different from all reference types, but this is not true in the presence of autoboxing, and it has caused real trouble. Consider the following program:

在 Java 5 之前，所有原始类型都与所有引用类型完全不同，但在自动装箱时并非如此，这造成了真正的麻烦。考虑以下方案：

```java
public class SetList {
public static void main(String[] args) {
    Set<Integer> set = new TreeSet<>();
    List<Integer> list = new ArrayList<>();
    for (int i = -3; i < 3; i++) {
        set.add(i);
        list.add(i);
    }
    for (int i = 0; i < 3; i++) {
        set.remove(i);
        list.remove(i);
    }
    System.out.println(set +""+list);
    }
}
```

First, the program adds the integers from −3 to 2, inclusive, to a sorted set and a list. Then, it makes three identical calls to remove on the set and the list. If you’re like most people, you’d expect the program to remove the non-negative values (0, 1, and 2) from the set and the list and to print [-3, -2, -1][-3, -2, -1]. In fact, the program removes the non-negative values from the set and the odd values from the list and prints [-3, -2, -1][-2, 0, 2]. It is an understatement to call this behavior confusing.

首先，程序将从 -3 到 2 的整数（包括）添加到已排序的 Set 和 List 中。然后，它执行三个相同的调用来删除集合和列表。如果你和大多数人一样，你希望程序从集合和列表中删除非负值（0、1 和 2），并打印 `[-3,2,1][-3,2,1]`。实际上，程序从 Set 中删除非负值，从 List 中删除奇数值，并输出 `[-3,2,1][-2,0,2]`。把这种行为称为混乱，只是一种保守的说法。

Here’s what’s happening: The call to set.remove(i) selects the overloading remove(E), where E is the element type of the set (Integer), and autoboxes i from int to Integer. This is the behavior you’d expect, so the program ends up removing the positive values from the set. The call to list.remove(i), on the other hand, selects the overloading remove(int i), which removes the element at the specified position in the list. If you start with the list [-3, -2, -1, 0, 1, 2] and remove the zeroth element, then the first, and then the second, you’re left with [-2, 0, 2], and the mystery is solved. To fix the problem, cast list.remove’s argument to Integer, forcing the correct overloading to be selected. Alternatively, you could invoke Integer.valueOf on i and pass the result to list.remove. Either way, the program prints [-3, -2, -1][-3, -2, -1], as expected:

实际情况如下：调用 `set.remove(i)` 选择重载 `remove(E)`，其中 E 是 set （Integer）的元素类型，而将从 int 自动装箱到 Integer 中。这是你期望的行为，因此程序最终会从 Set 中删除正值。另一方面，对 `list.remove(i)` 的调用选择重载 `remove(int i)`，它将删除 List 中指定位置的元素。如果从 List `[-3，-2，-1,0,1,2]` 开始，移除第 0 个元素，然后是第 1 个，然后是第 2 个，就只剩下 `[-2,0,2]`，谜底就解开了。若要修复此问题，要将 `list.remove` 的参数转换成 Integer，强制选择正确的重载。或者，你可以调用 `Integer.valuef()`，然后将结果传递给 `list.remove`。无论哪种方式，程序都会按预期打印 `[-3, -2, -1] [-3, -2, -1]`:

```java
for (int i = 0; i < 3; i++) {
    set.remove(i);
    list.remove((Integer) i); // or remove(Integer.valueOf(i))
}
```

The confusing behavior demonstrated by the previous example came about because the List<E> interface has two overloadings of the remove method: remove(E) and remove(int). Prior to Java 5 when the List interface was “generified,” it had a remove(Object) method in place of remove(E), and the corresponding parameter types, Object and int, were radically different. But in the presence of generics and autoboxing, the two parameter types are no longer radically different. In other words, adding generics and autoboxing to the language damaged the List interface. Luckily, few if any other APIs in the Java libraries were similarly damaged, but this tale makes it clear that autoboxing and generics increased the importance of caution when overloading. The addition of lambdas and method references in Java 8 further increased the potential for confusion in overloading. For example, consider these two snippets:

前一个示例所演示的令人困惑的行为是由于 List<E> 接口对 remove 方法有两个重载：`remove(E)` 和 `remove(int)`。在 Java 5 之前，当 List 接口被「泛化」时，它有一个 `remove(Object)` 方法代替 `remove(E)`，而相应的参数类型 Object 和 int 则完全不同。但是，在泛型和自动装箱的存在下，这两种参数类型不再完全不同。换句话说，在语言中添加泛型和自动装箱破坏了 List 接口。幸运的是，Java 库中的其他 API 几乎没有受到类似的破坏，但是这个故事清楚地表明，自动装箱和泛型出现后，在重载时就应更加谨慎。Java 8 中添加的 lambdas 和方法引用进一步增加了重载中混淆的可能性。例如，考虑以下两个片段：

```java
new Thread(System.out::println).start();
ExecutorService exec = Executors.newCachedThreadPool();
exec.submit(System.out::println);
```

While the Thread constructor invocation and the submit method invocation look similar, the former compiles while the latter does not. The arguments are identical (System.out::println), and both the constructor and the method have an overloading that takes a Runnable. What’s going on here? The surprising answer is that the submit method has an overloading that takes a `Callable<T>`, while the Thread constructor does not. You might think that this shouldn’t make any difference because all overloadings of println return void, so the method reference couldn’t possibly be a Callable. This makes perfect sense, but it’s not the way the overload resolution algorithm works. Perhaps equally surprising is that the submit method invocation would be legal if the println method weren’t also overloaded. It is the combination of the overloading of the referenced method (println) and the invoked method (submit) that prevents the overload resolution algorithm from behaving as you’d expect.

虽然 Thread 构造函数调用和 submit 方法调用看起来很相似，但是前者编译而后者不编译。参数是相同的 `System.out::println`，构造函数和方法都有一个重载，该重载接受 Runnable。这是怎么回事？令人惊讶的答案是，submit 方法有一个重载，它接受一个 `Callable<T>`，而线程构造函数没有。你可能认为这不会有什么区别，因为 println 的所有重载都会返回 void，所以方法引用不可能是 Callable。这很有道理，但重载解析算法不是这样工作的。也许同样令人惊讶的是，如果 println 方法没有被重载，那么 submit 方法调用将是合法的。正是被引用的方法 println 和被调用的方法 submit 的重载相结合，阻止了重载解析算法按照你所期望的那样运行。

Technically speaking, the problem is that System.out::println is an inexact method reference [JLS, 15.13.1] and that “certain argument expressions that contain implicitly typed lambda expressions or inexact method references are ignored by the applicability tests, because their meaning cannot be determined until a target type is selected [JLS, 15.12.2].” Don’t worry if you don’t understand this passage; it is aimed at compiler writers. The key point is that overloading methods or constructors with different functional interfaces in the same argument position causes confusion. Therefore, **do not overload methods to take different functional interfaces in the same argument position.** In the parlance of this item, different functional interfaces are not radically different. The Java compiler will warn you about this sort of problematic overload if you pass the command line switch - Xlint:overloads.

从技术上讲，问题出在 System.out::println 上，它是一个不准确的方法引用 [JLS, 15.13.1]，并且「某些包含隐式类型化 lambda 表达式或不准确的方法引用的参数表达式会被适用性测试忽略，因为它们的含义在选择目标类型之前无法确定 [JLS, 15.12.2]。」如果你不明白这段话，不要担心；它的目标是编译器编写器。关键是在相同的参数位置上重载具有不同功能接口的方法或构造函数会导致混淆。因此，**不要重载方法来在相同的参数位置上使用不同的函数式接口。** 用本项目的话说，不同的函数式接口并没有根本的不同。如果你通过命令行开关 `Xlint:overloads`, Java 编译器将对这种有问题的重载发出警告。

Array types and class types other than Object are radically different. Also, array types and interface types other than Serializable and Cloneable are radically different. Two distinct classes are said to be unrelated if neither class is a descendant of the other [JLS, 5.5]. For example, String and Throwable are unrelated. It is impossible for any object to be an instance of two unrelated classes, so unrelated classes are radically different, too.

数组类型和 Object 以外的类类型是完全不同的。此外，数组类型和 Serializable 和 Cloneable 之外的接口类型也完全不同。如果两个不同的类都不是另一个类的后代 [JLS, 5.5]，则称它们是不相关的。例如，String 和 Throwable 是不相关的。任何对象都不可能是两个不相关类的实例，所以不相关的类也是完全不同的。

There are other pairs of types that can’t be converted in either direction [JLS, 5.1.12], but once you go beyond the simple cases described above, it becomes very difficult for most programmers to discern which, if any, overloading applies to a set of actual parameters. The rules that determine which overloading is selected are extremely complex and grow more complex with every release. Few programmers understand all of their subtleties.

还有其他成对的类不能在任何方向相互转换 [JLS, 5.1.12]，但是一旦超出上面描述的简单情况，大多数程序员就很难辨别一组参数应该调用哪一种方法重载。决定选择哪个重载的规则非常复杂，并且随着每个版本的发布而变得越来越复杂。很少有程序员能理解它们所有的微妙之处。

There may be times when you feel the need to violate the guidelines in this item, especially when evolving existing classes. For example, consider String, which has had a contentEquals(StringBuffer) method since Java 4. In Java 5, CharSequence was added to provide a common interface for StringBuffer, StringBuilder, String, CharBuffer, and other similar types. At the same time that CharSequence was added, String was outfitted with an overloading of the contentEquals method that takes a CharSequence.

有时候，你可能觉得会被迫违反本条目中的指导原则，特别是在更新现有类时。例如，考虑 String，它从 Java 4 开始就有一个 `contentEquals(StringBuffer)` 方法。在 Java 5 中，添加了 CharSequence 来为 StringBuffer、StringBuilder、String、CharBuffer 和其他类似类型提供公共接口。在添加 CharSequence 的同时，String 还配备了一个重载的 contentEquals 方法，该方法接受 CharSequence。

While the resulting overloading clearly violates the guidelines in this item, it causes no harm because both overloaded methods do exactly the same thing when they are invoked on the same object reference. The programmer may not know which overloading will be invoked, but it is of no consequence so long as they behave identically. The standard way to ensure this behavior is to have the more specific overloading forward to the more general:

虽然这样的重载明显违反了此项中的指导原则，但它不会造成任何危害，因为当在同一个对象引用上调用这两个重载方法时，它们做的是完全相同的事情。程序员可能不知道将调用哪个重载，但只要它们的行为相同，就没有什么不良后果。确保这种行为的标准方法是将更具体的重载转发给更一般的重载：

```java
// Ensuring that 2 methods have identical behavior by forwarding
public boolean contentEquals(StringBuffer sb) {
    return contentEquals((CharSequence) sb);
}
```

While the Java libraries largely adhere to the spirit of the advice in this item, there are a number of classes that violate it. For example, String exports two overloaded static factory methods, valueOf(char[]) and valueOf(Object), that do completely different things when passed the same object reference. There is no real justification for this, and it should be regarded as an anomaly with the potential for real confusion.

虽然 Java 库在很大程度上遵循了本条目中的主旨精神，但是有一些类违反了它。例如，String 导出两个重载的静态工厂方法 `valueOf(char[])` 和 `valueOf(Object)`，它们在传递相同的对象引用时执行完全不同的操作。这样做没有真正的理由，它应该被视为一种异常行为，有可能造成真正的混乱。

To summarize, just because you can overload methods doesn’t mean you should. It is generally best to refrain from overloading methods with multiple signatures that have the same number of parameters. In some cases, especially where constructors are involved, it may be impossible to follow this advice. In these cases, you should at least avoid situations where the same set of parameters can be passed to different overloadings by the addition of casts. If this cannot be avoided, for example, because you are retrofitting an existing class to implement a new interface, you should ensure that all overloadings behave identically when passed the same parameters. If you fail to do this, programmers will be hard pressed to make effective use of the overloaded method or constructor, and they won’t understand why it doesn’t work.

总而言之，方法可以重载，但并不意味着就应该这样做。通常，最好避免重载具有相同数量参数的多个签名的方法。在某些情况下，特别是涉及构造函数的情况下，可能难以遵循这个建议。在这些情况下，你至少应该避免同一组参数只需经过类型转换就可以被传递给不同的重载方法。如果这是无法避免的，例如，因为要对现有类进行改造以实现新接口，那么应该确保在传递相同的参数时，所有重载的行为都是相同的。如果你做不到这一点，程序员将很难有效地使用重载方法或构造函数，他们将无法理解为什么它不能工作。

---

## 【53】明智地使用可变参数

> Use varargs judiciously

Varargs methods, formally known as variable arity methods [JLS, 8.4.1], accept zero or more arguments of a specified type. The varargs facility works by first creating an array whose size is the number of arguments passed at the call site, then putting the argument values into the array, and finally passing the array to the method.

可变参数方法的正式名称是 variable arity methods [JLS, 8.4.1]，它接受指定类型的零个或多个参数。可变参数首先创建一个数组，其大小是在调用点上传递的参数数量，然后将参数值放入数组，最后将数组传递给方法。

For example, here is a varargs method that takes a sequence of int arguments and returns their sum. As you would expect, the value of sum(1, 2, 3) is 6, and the value of sum() is 0:

例如，这里有一个可变参数方法，它接受一系列 int 参数并返回它们的和。如你所料，`sum(1, 2, 3)` 的值为 6，`sum()` 的值为 0：

```java
// Simple use of varargs
static int sum(int... args) {
    int sum = 0;
    for (int arg : args)
        sum += arg;
    return sum;
}
```

Sometimes it’s appropriate to write a method that requires one or more arguments of some type, rather than zero or more. For example, suppose you want to write a function that computes the minimum of its arguments. This function is not well defined if the client passes no arguments. You could check the array length at runtime:

有时，编写一个方法需要一个或多个某种类型的参数，而不是零个或多个参数，这是合适的。例如，假设你想编写一个函数来计算其参数的最小值。如果客户端不传递参数，则此函数定义得不好。你可以在运行时检查数组长度：

```java
// The WRONG way to use varargs to pass one or more arguments!
static int min(int... args) {
    if (args.length == 0)
        throw new IllegalArgumentException("Too few arguments");
    int min = args[0];
    for (int i = 1; i < args.length; i++)
        if (args[i] < min)
    min = args[i];
    return min;
}
```

This solution has several problems. The most serious is that if the client invokes this method with no arguments, it fails at runtime rather than compile time. Another problem is that it is ugly. You have to include an explicit validity check on args, and you can’t use a for-each loop unless you initialize min to Integer.MAX_VALUE, which is also ugly.

这个解决方案有几个问题。最严重的情况是，如果客户端不带参数调用此方法，那么它将在运行时而不是编译时失败。另一个问题是它不美观。必须包含对 args 的显式有效性检查，并且不能使用 for-each 循环，除非将 min 初始化为 Integer.MAX_VALUE，也很不美观。

Luckily there’s a much better way to achieve the desired effect. Declare the method to take two parameters, one normal parameter of the specified type and one varargs parameter of this type. This solution corrects all the deficiencies of the previous one:

幸运的是，有一种更好的方法可以达到预期的效果。声明方法获取两个参数，一个指定类型的常规参数和一个该类型的可变参数。这个解决方案弥补了前一个解决方案的所有不足：

```java
// The right way to use varargs to pass one or more arguments
static int min(int firstArg, int... remainingArgs) {
    int min = firstArg;
    for (int arg : remainingArgs)
        if (arg < min)
    min = arg;
    return min;
}
```

As you can see from this example, varargs are effective in circumstances where you want a method with a variable number of arguments. Varargs were designed for printf, which was added to the platform at the same time as varargs, and for the core reflection facility (Item 65), which was retrofitted. Both printf and reflection benefited enormously from varargs.

从这个例子中可以看出，在方法需要参数数量可变的情况下，可变参数是有效的。可变参数是为 printf 和经过改造的核心反射机制（Item-65）而设计的，它们与可变参数同时被添加到 JDK，printf 和 reflection 都从可变参数中受益匪浅。

Exercise care when using varargs in performance-critical situations. Every invocation of a varargs method causes an array allocation and initialization. If you have determined empirically that you can’t afford this cost but you need the flexibility of varargs, there is a pattern that lets you have your cake and eat it too. Suppose you’ve determined that 95 percent of the calls to a method have three or fewer parameters. Then declare five overloadings of the method, one each with zero through three ordinary parameters, and a single varargs method for use when the number of arguments exceeds three:

在性能关键的情况下使用可变参数时要小心。每次调用可变参数方法都会导致数组分配和初始化。如果你已经从经验上确定你负担不起这个成本，但是你仍需要可变参数的灵活性，那么有一种模式可以让你鱼与熊掌兼得。假设你已经确定对方法 95% 的调用只需要三个或更少的参数。可以声明该方法的 5 个重载，每个重载 0 到 3 个普通参数，当参数数量超过 3 个时引入可变参数：

```java
public void foo() { }
public void foo(int a1) { }
public void foo(int a1, int a2) { }
public void foo(int a1, int a2, int a3) { }
public void foo(int a1, int a2, int a3, int... rest) { }
```

Now you know that you’ll pay the cost of the array creation only in the 5 percent of all invocations where the number of parameters exceeds three. Like most performance optimizations, this technique usually isn’t appropriate, but when it is, it’s a lifesaver.

现在你知道，在所有参数数量超过 3 的调用中，只有 5% 的调用需要付出创建数组的成本。与大多数性能优化一样，这种技术使用并不广泛，但当它合适出现时，就是一个救星。

The static factories for EnumSet use this technique to reduce the cost of creating enum sets to a minimum. This was appropriate because it was critical that enum sets provide a performance-competitive replacement for bit fields (Item 36).

EnumSet 的静态工厂使用这种技术将创建枚举集的成本降到最低。这是适当的，因为 enum 集合为位字段提供具有性能竞争力的替代方法是至关重要的（Item-36）。

In summary, varargs are invaluable when you need to define methods with a variable number of arguments. Precede the varargs parameter with any required parameters, and be aware of the performance consequences of using varargs.

总之，当你需要定义具有不确定数量参数的方法时，可变参数是非常有用的。在可变参数之前加上任何必需的参数，并注意使用可变参数可能会引发的性能后果。

---

## 【54】返回空集合或数组，而不是 null

> Return empty collections or arrays, not nulls

It is not uncommon to see methods that look something like this:

如下的方法很常见：

```java
// Returns null to indicate an empty collection. Don't do this!
private final List<Cheese> cheesesInStock = ...;
/**
* @return a list containing all of the cheeses in the shop,
* or null if no cheeses are available for purchase.
*/
public List<Cheese> getCheeses() {
    return cheesesInStock.isEmpty() ? null: new ArrayList<>(cheesesInStock);
}
```

There is no reason to special-case the situation where no cheeses are available for purchase. Doing so requires extra code in the client to handle the possibly null return value, for example:

没有理由对没有奶酪可供购买的情况进行特殊处理。如果这样做，在客户端需要额外的代码处理可能为空的返回值，例如：

```java
List<Cheese> cheeses = shop.getCheeses();
if (cheeses != null && cheeses.contains(Cheese.STILTON))
    System.out.println("Jolly good, just the thing.");
```

This sort of circumlocution is required in nearly every use of a method that returns null in place of an empty collection or array. It is error-prone, because the programmer writing the client might forget to write the special-case code to handle a null return. Such an error may go unnoticed for years because such methods usually return one or more objects. Also, returning null in place of an empty container complicates the implementation of the method returning the container.

在几乎每次使用返回 null 来代替空集合或数组的方法时，都需要使用这种权宜之计。它很容易出错，因为编写客户端的程序员可能忘记编写特殊情况的代码来处理 null 返回。这样的错误可能会被忽略多年，因为这样的方法通常返回一个或多个对象。此外，在空容器中返回 null 会使返回容器的方法的实现复杂化。

It is sometimes argued that a null return value is preferable to an empty collection or array because it avoids the expense of allocating the empty container. This argument fails on two counts. First, it is inadvisable to worry about performance at this level unless measurements have shown that the allocation in question is a real contributor to performance problems (Item 67). Second, it is possible to return empty collections and arrays without allocating them. Here is the typical code to return a possibly empty collection. Usually, this is all you need:

有时有人认为，空返回值比空集合或数组更可取，因为它避免了分配空容器的开销。这个论点有两点是不成立的。首先，在这个级别上担心性能是不明智的，除非分析表明这个方法正是造成性能问题的真正源头（Item-67）。第二，返回空集合和数组而不分配它们是可能的。下面是返回可能为空的集合的典型代码。通常，这就是你所需要的：

```java
//The right way to return a possibly empty collection
public List<Cheese> getCheeses() {
    return new ArrayList<>(cheesesInStock);
}
```

In the unlikely event that you have evidence suggesting that allocating empty collections is harming performance, you can avoid the allocations by returning the same immutable empty collection repeatedly, as immutable objects may be shared freely (Item 17). Here is the code to do it, using the Collections.emptyList method. If you were returning a set, you’d use Collections.emptySet; if you were returning a map, you’d use Collections.emptyMap. But remember, this is an optimization, and it’s seldom called for. If you think you need it, measure performance before and after, to ensure that it’s actually helping:

在不太可能的情况下，你有证据表明分配空集合会损害性能，你可以通过重复返回相同的不可变空集合来避免分配，因为不可变对象可以自由共享（Item-17）。下面是使用 `Collections.emptyList` 完成此任务的代码。如果你要返回一个 Set，你会使用 `Collections.emptySet`；如果要返回 Map，则使用 `Collections.emptyMap`。但是请记住，这是一个优化，很少真正需要它。如果你认为你需要它，测试一下前后的表现，确保它确实有帮助：

```java
// Optimization - avoids allocating empty collections
public List<Cheese> getCheeses() {
    return cheesesInStock.isEmpty() ? Collections.emptyList(): new ArrayList<>(cheesesInStock);
}
```

The situation for arrays is identical to that for collections. Never return null instead of a zero-length array. Normally, you should simply return an array of the correct length, which may be zero. Note that we’re passing a zero-length array into the toArray method to indicate the desired return type, which is Cheese[]:

数组的情况与集合的情况相同。永远不要返回 null，而应该返回零长度的数组。通常，你应该简单地返回一个正确长度的数组，它可能是零长度。注意，我们将一个零长度的数组传递到 toArray 方法中，以指示所需的返回类型，即 Cheese[0]：

```java
//The right way to return a possibly empty array
public Cheese[] getCheeses() {
    return cheesesInStock.toArray(new Cheese[0]);
}
```

If you believe that allocating zero-length arrays is harming performance, you can return the same zero-length array repeatedly because all zero-length arrays are immutable:

如果你认为分配零长度数组会损害性能，你可以重复返回相同的零长度数组，因为所有的零长度数组都是不可变的：

```java
// Optimization - avoids allocating empty arrays
private static final Cheese[] EMPTY_CHEESE_ARRAY = new Cheese[0];
public Cheese[] getCheeses() {
    return cheesesInStock.toArray(EMPTY_CHEESE_ARRAY);
}
```

In the optimized version, we pass the same empty array into every toArray call, and this array will be returned from getCheeses whenever cheesesInStock is empty. Do not preallocate the array passed to toArray in hopes of improving performance. Studies have shown that it is counterproductive [Shipilëv16]:

在优化版本中，我们将相同的空数组传递到每个 toArray 调用中，当 cheesesInStock 为空时，这个数组将从 getCheeses 返回。不要为了提高性能而预先分配传递给 toArray 的数组。研究表明，这样做会适得其反 [Shipilev16]:

```java
// Don’t do this - preallocating the array harms performance!
return cheesesInStock.toArray(new Cheese[cheesesInStock.size()]);
```

In summary, never return null in place of an empty array or collection. It makes your API more difficult to use and more prone to error, and it has no performance advantages.

总之，永远不要用 null 来代替空数组或集合。它使你的 API 更难以使用，更容易出错，并且没有性能优势。

---

## 【55】明智地的返回 Optional

> Return optionals judiciously

Prior to Java 8, there were two approaches you could take when writing a method that was unable to return a value under certain circumstances. Either you could throw an exception, or you could return null (assuming the return type was an object reference type). Neither of these approaches is perfect. Exceptions should be reserved for exceptional conditions (Item 69), and throwing an exception is expensive because the entire stack trace is captured when an exception is created. Returning null doesn’t have these shortcomings, but it has its own. If a method returns null, clients must contain special-case code to deal with the possibility of a null return, unless the programmer can prove that a null return is impossible. If a client neglects to check for a null return and stores a null return value away in some data structure, a NullPointerException may result at some arbitrary time in the future, at some place in the code that has nothing to do with the problem.

在 Java 8 之前，在编写在某些情况下无法返回值的方法时，可以采用两种方法。要么抛出异常，要么返回 null（假设返回类型是对象引用类型）。这两种方法都不完美。应该为异常条件保留异常（Item-69），并且抛出异常代价高昂，因为在创建异常时捕获整个堆栈跟踪。返回 null 没有这些缺点，但是它有自己的缺点。如果方法返回 null，客户端必须包含特殊情况代码来处理 null 返回的可能性，除非程序员能够证明 null 返回是不可能的。如果客户端忽略检查 null 返回并将 null 返回值存储在某个数据结构中，那么 NullPointerException 可能会在将来的某个时间，在代码中的某个与该问题无关的位置产生。

In Java 8, there is a third approach to writing methods that may not be able to return a value. The `Optional<T>` class represents an immutable container that can hold either a single non-null T reference or nothing at all. An optional that contains nothing is said to be empty. A value is said to be present in an optional that is not empty. An optional is essentially an immutable collection that can hold at most one element. `Optional<T>` does not implement `Collection<T>`, but it could in principle.

在 Java 8 中，还有第三种方法来编写可能无法返回值的方法。`Optional<T>` 类表示一个不可变的容器，它可以包含一个非空的 T 引用，也可以什么都不包含。不包含任何内容的 Optional 被称为空。一个值被认为存在于一个非空的 Optional 中。Optional 的本质上是一个不可变的集合，它最多可以容纳一个元素。`Optional<T>` 不实现 `Collection<T>`，但原则上可以。

A method that conceptually returns a T but may be unable to do so under certain circumstances can instead be declared to return an `Optional<T>`. This allows the method to return an empty result to indicate that it couldn’t return a valid result. An Optional-returning method is more flexible and easier to use than one that throws an exception, and it is less error-prone than one that returns null.

理论上应返回 T，但在某些情况下可能无法返回 T 的方法可以将返回值声明为 `Optional<T>`。这允许该方法返回一个空结果来表明它不能返回有效的结果。具备 Optional 返回值的方法比抛出异常的方法更灵活、更容易使用，并且比返回 null 的方法更不容易出错。

In Item 30, we showed this method to calculate the maximum value in a collection, according to its elements’ natural order.

在 Item-30 中，我们展示了根据集合元素的自然顺序计算集合最大值的方法。

```java
// Returns maximum value in collection - throws exception if empty
public static <E extends Comparable<E>> E max(Collection<E> c) {
    if (c.isEmpty())
        throw new IllegalArgumentException("Empty collection");
    E result = null;
    for (E e : c)
        if (result == null || e.compareTo(result) > 0)
    result = Objects.requireNonNull(e);
    return result;
}
```

This method throws an IllegalArgumentException if the given collection is empty. We mentioned in Item 30 that a better alternative would be to return `Optional<E>`. Here’s how the method looks when it is modified to do so:

如果给定集合为空，此方法将抛出 IllegalArgumentException。我们在 Item-30 中提到，更好的替代方法是返回 `Optional<E>`。

```java
// Returns maximum value in collection as an Optional<E>
public static <E extends Comparable<E>> Optional<E> max(Collection<E> c) {
    if (c.isEmpty())
        return Optional.empty();
    E result = null;
    for (E e : c)
        if (result == null || e.compareTo(result) > 0)
    result = Objects.requireNonNull(e);
    return Optional.of(result);
}
```

As you can see, it is straightforward to return an optional. All you have to do is to create the optional with the appropriate static factory. In this program, we use two: Optional.empty() returns an empty optional, and Optional.of(value) returns an optional containing the given non-null value. It is a programming error to pass null to Optional.of(value). If you do this, the method responds by throwing a NullPointerException. The Optional.ofNullable(value) method accepts a possibly null value and returns an empty optional if null is passed in. **Never return a null value from an Optional-returning method:** it defeats the entire purpose of the facility.

如你所见，返回一个 Optional 是很简单的。你所要做的就是使用适当的静态工厂创建。在这个程序中，我们使用了两个静态工厂：`Optional.empty()` 返回一个空的 Optional，`Optional.of(value)` 返回一个包含给定非空值的可选值。将 null 传递给 `Optional.of(value)` 是一个编程错误。如果你这样做，该方法将通过抛出 NullPointerException 来响应。`Optional.ofNullable(value)` 方法接受一个可能为空的值，如果传入 null，则返回一个空的 Optional。**永远不要从具备 Optional 返回值的方法返回空值:** 它违背了这个功能的设计初衷。

Many terminal operations on streams return optionals. If we rewrite the max method to use a stream, Stream’s max operation does the work of generating an optional for us (though we do have to pass in an explicit comparator):

许多流上的 Terminal 操作返回 Optional。如果我们使用一个流来重写 max 方法，那么流版本的 max 操作会为我们生成一个 Optional（尽管我们必须传递一个显式的 comparator）：

```java
// Returns max val in collection as Optional<E> - uses stream
public static <E extends Comparable<E>> Optional<E> max(Collection<E> c) {
    return c.stream().max(Comparator.naturalOrder());
}
```

So how do you choose to return an optional instead of returning a null or throwing an exception? Optionals are similar in spirit to checked exceptions (Item 71), in that they force the user of an API to confront the fact that there may be no value returned. Throwing an unchecked exception or returning a null allows the user to ignore this eventuality, with potentially dire consequences. However, throwing a checked exception requires additional boilerplate code in the client.

那么，如何选择是返回 Optional 而不是返回 null 或抛出异常呢？Optional 在本质上类似于已检查异常（Item-71），因为它们迫使 API 的用户面对可能没有返回值的事实。抛出未检查的异常或返回 null 允许用户忽略这种可能性，从而带来潜在的可怕后果。但是，抛出一个已检查的异常需要在客户端中添加额外的样板代码。

If a method returns an optional, the client gets to choose what action to take if the method can’t return a value. You can specify a default value:

如果一个方法返回一个 Optional，客户端可以选择如果该方法不能返回值该采取什么操作。你可以指定一个默认值：

```java
// Using an optional to provide a chosen default value
String lastWordInLexicon = max(words).orElse("No words...");
```

or you can throw any exception that is appropriate. Note that we pass in an exception factory rather than an actual exception. This avoids the expense of creating the exception unless it will actually be thrown:

或者你可以抛出任何适当的异常。注意，我们传递的是异常工厂，而不是实际的异常。这避免了创建异常的开销，除非它实际被抛出：

```java
// Using an optional to throw a chosen exception
Toy myToy = max(toys).orElseThrow(TemperTantrumException::new);
```

If you can prove that an optional is nonempty, you can get the value from the optional without specifying an action to take if the optional is empty, but if you’re wrong, your code will throw a NoSuchElementException:

如果你能证明一个 Optional 非空，你可以从 Optional 获取值，而不需要指定一个操作来执行，如果 Optional 是空的，但是如果你错了，你的代码会抛出一个 NoSuchElementException：

```java
// Using optional when you know there’s a return value
Element lastNobleGas = max(Elements.NOBLE_GASES).get();
```

Occasionally you may be faced with a situation where it’s expensive to get the default value, and you want to avoid that cost unless it’s necessary. For these situations, Optional provides a method that takes a `Supplier<T>` and invokes it only when necessary. This method is called orElseGet, but perhaps it should have been called orElseCompute because it is closely related to the three Map methods whose names begin with compute. There are several Optional methods for dealing with more specialized use cases: filter, map, flatMap, and ifPresent. In Java 9, two more of these methods were added: or and ifPresentOrElse. If the basic methods described above aren’t a good match for your use case, look at the documentation for these more advanced methods and see if they do the job.

有时候，你可能会遇到这样一种情况：获取默认值的代价很高，除非必要，否则你希望避免这种代价。对于这些情况，Optional 提供了一个方法，该方法接受 `Supplier<T>`，并仅在必要时调用它。这个方法被称为 orElseGet，但是它可能应该被称为 orElseCompute，因为它与以 compute 开头的三个 Map 方法密切相关。有几个 Optional 的方法来处理更特殊的用例：filter、map、flatMap 和 ifPresent。在 Java 9 中，又添加了两个这样的方法：or 和 ifPresentOrElse。如果上面描述的基本方法与你的实例不太匹配，请查看这些更高级方法的文档，确认它们是否能够完成任务。

In case none of these methods meets your needs, Optional provides the isPresent() method, which may be viewed as a safety valve. It returns true if the optional contains a value, false if it’s empty. You can use this method to perform any processing you like on an optional result, but make sure to use it wisely. Many uses of isPresent can profitably be replaced by one of the methods mentioned above. The resulting code will typically be shorter, clearer, and more idiomatic.

如果这些方法都不能满足你的需要，Optional 提供 `isPresent()` 方法，可以将其视为安全阀。如果 Optional 包含值，则返回 true；如果为空，则返回 false。你可以使用此方法对 Optional 结果执行任何你希望进行的处理，但请确保明智地使用它。`isPresent()` 的许多用途都可以被上面提到的方法所替代，如此生成的代码可以更短、更清晰、更符合习惯。

For example, consider this code snippet, which prints the process ID of the parent of a process, or N/A if the process has no parent. The snippet uses the ProcessHandle class, introduced in Java 9:

例如，考虑这段代码，它打印一个进程的父进程的 ID，如果进程没有父进程，则打印 N/A。该代码段使用了在 Java 9 中引入的 ProcessHandle 类：

```java
Optional<ProcessHandle> parentProcess = ph.parent();
System.out.println("Parent PID: " + (parentProcess.isPresent() ?
String.valueOf(parentProcess.get().pid()) : "N/A"));
```

The code snippet above can be replaced by this one, which uses Optional’s map function:

上面的代码片段可以替换为如下形式，它使用了 Optional 的 map 函数：

```java
System.out.println("Parent PID: " + ph.parent().map(h -> String.valueOf(h.pid())).orElse("N/A"));
```

When programming with streams, it is not uncommon to find yourself with a `Stream<Optional<T>>` and to require a `Stream<T>` containing all the elements in the nonempty optionals in order to proceed. If you’re using Java 8, here’s how to bridge the gap:

当使用流进行编程时，通常会发现你经常使用 `Stream<Optional<T>>`，并且需要一个 `Stream<T>`，其中包含非空 Optional 中的所有元素，以便继续。如果你正在使用 Java 8，下面的语句演示了如何弥补这个不足：

```java
streamOfOptionals.filter(Optional::isPresent).map(Optional::get)
```

In Java 9, Optional was outfitted with a stream() method. This method is an adapter that turns an Optional into a Stream containing an element if one is present in the optional, or none if it is empty. In conjunction with Stream’s flatMap method (Item 45), this method provides a concise replacement for the code snippet above:

在 Java 9 中，Optional 配备了一个 `stream()` 方法。这个方法是一个适配器，它将一个 Optional 元素转换成一个包含元素的流（如果一个元素出现在 Optional 元素中），如果一个元素是空的，则一个元素都没有。与 Stream 的 flatMap 方法（Item-45）相结合，这个方法为上面的代码段提供了一个简洁的替换版本：

```java
streamOfOptionals..flatMap(Optional::stream)
```

Not all return types benefit from the optional treatment. **Container types, including collections, maps, streams, arrays, and optionals should not be wrapped in optionals.** Rather than returning an empty `Optional<List<T>>`, you should simply return an empty `List<T>` (Item 54). Returning the empty container will eliminate the need for client code to process an optional. The ProcessHandle class does have the arguments method, which returns `Optional<String[]>`, but this method should be regarded as an anomaly that is not to be emulated.

并不是所有的返回类型都能从 Optional 处理中获益。**容器类型，包括集合、Map、流、数组和 Optional，不应该封装在 Optional 中。** 你应该简单的返回一个空的 `List<T>`，而不是一个空的 `Optional<List<T>>`（Item-54）。返回空容器将消除客户端代码处理 Optional 容器的需要。ProcessHandle 类确实有 arguments 方法，它返回 `Optional<String[]>`，但是这个方法应该被视为一种特例，不应该被仿效。

So when should you declare a method to return `Optional<T>` rather than T? As a rule, **you should declare a method to return `Optional<T>` if it might not be able to return a result and clients will have to perform special processing if no result is returned.** That said, returning an `Optional<T>` is not without cost. An Optional is an object that has to be allocated and initialized, and reading the value out of the optional requires an extra indirection. This makes optionals inappropriate for use in some performance-critical situations. Whether a particular method falls into this category can only be determined by careful measurement (Item 67).

那么，什么时候应该声明一个方法来返回 `Optional<T>` 而不是 T 呢？作为规则，**你应该声明一个方法来返回 `Optional<T>`（如果它可能无法返回结果），如果没有返回结果，客户端将不得不执行特殊处理。** 也就是说，返回 `Optional<T>` 并不是没有代价的。Optional 对象必须分配和初始化，从 Optional 对象中读取值需要额外的间接操作。这使得 Optional 不适合在某些性能关键的情况下使用。某一特定方法是否属于这一情况只能通过仔细衡量来确定（Item-67）。

Returning an optional that contains a boxed primitive type is prohibitively expensive compared to returning a primitive type because the optional has two levels of boxing instead of zero. Therefore, the library designers saw fit to provide analogues of `Optional<T>` for the primitive types int, long, and double. These optional types are OptionalInt, OptionalLong, and OptionalDouble. They contain most, but not all, of the methods on `Optional<T>`. Therefore, **you should never return an optional of a boxed primitive type,** with the possible exception of the “minor primitive types,” Boolean, Byte, Character, Short, and Float.

与返回基本数据类型相比，返回包含包装类的 Optional 类型的代价高得惊人，因为 Optional 类型有两个装箱级别，而不是零。因此，库设计人员认为应该为基本类型 int、long 和 double 提供类似的 `Optional<T>`。这些可选类型是 OptionalInt、OptionalLong 和 OptionalDouble。它们包含 `Optional<T>` 上的大多数方法，但不是所有方法。因此，**永远不应该返包装类的 Optional**，可能除了「次基本数据类型」，如 Boolean、Byte、Character、Short 和 Float 之外。

Thus far, we have discussed returning optionals and processing them after they are returned. We have not discussed other possible uses, and that is because most other uses of optionals are suspect. For example, you should never use optionals as map values. If you do, you have two ways of expressing a key’s logical absence from the map: either the key can be absent from the map, or it can be present and map to an empty optional. This represents needless complexity with great potential for confusion and errors. More generally, **it is almost never appropriate to use an optional as a key, value, or element in a collection or array.**

到目前为止，我们已经讨论了返回 Optional 并在返回后如何处理它们。我们还没有讨论其他可能的用法，这是因为大多数其他 Optional 用法都是值得疑的。例如，永远不要将 Optional 用作 Map 的值。如果这样做，则有两种方法可以表示键在 Map 中逻辑上的缺失：键可以不在 Map 中，也可以存在并映射到空的 Optional。这代表了不必要的复杂性，很有可能导致混淆和错误。更一般地说，**在集合或数组中使用 Optional 作为键、值或元素几乎都是不合适的。**

This leaves a big question unanswered. Is it ever appropriate to store an optional in an instance field? Often it’s a “bad smell”: it suggests that perhaps you should have a subclass containing the optional fields. But sometimes it may be justified. Consider the case of our NutritionFacts class in Item 2. A NutritionFacts instance contains many fields that are not required. You can’t have a subclass for every possible combination of these fields. Also, the fields have primitive types, which make it awkward to express absence directly. The best API for NutritionFacts would return an optional from the getter for each optional field, so it makes good sense to simply store those optionals as fields in the object.

这留下了一个悬而未决的大问题。在实例字段中存储 Optional 字段是否合适？通常这是一种「代码中的不良习惯」：建议你可能应该有一个包含 Optional 字段的子类。但有时这可能是合理的。考虑 Item-2 中的 NutritionFacts 类的情况。NutritionFacts 实例包含许多不需要的字段。不能为这些字段的所有可能组合提供子类。此外，字段具有原始类型，这使得直接表示缺少非常困难。对于 NutritionFacts 最好的 API 将为每个可选字段从 getter 返回一个 Optional，因此将这些 Optional 作为字段存储在对象中是很有意义的。

In summary, if you find yourself writing a method that can’t always return a value and you believe it is important that users of the method consider this possibility every time they call it, then you should probably return an optional. You should, however, be aware that there are real performance consequences associated with returning optionals; for performance-critical methods, it may be better to return a null or throw an exception. Finally, you should rarely use an optional in any other capacity than as a return value.

总之，如果你发现自己编写的方法不能总是返回确定值，并且你认为该方法的用户在每次调用时应该考虑这种可能性，那么你可能应该让方法返回一个 Optional。但是，你应该意识到，返回 Optional 会带来实际的性能后果；对于性能关键的方法，最好返回 null 或抛出异常。最后，除了作为返回值之外，你几乎不应该以任何其他方式使用 Optional。

---

## 【56】为所有公开的 API 元素编写文档注释

> Write doc comments for all exposed API elements

If an API is to be usable, it must be documented. Traditionally, API documentation was generated manually, and keeping it in sync with code was a chore. The Java programming environment eases this task with the Javadoc utility. Javadoc generates API documentation automatically from source code with specially formatted documentation comments, more commonly known as doc comments.

如果 API 要可用，就必须对其进行文档化。传统上，API 文档是手工生成的，保持与代码的同步是一件苦差事。Java 编程环境使用 Javadoc 实用程序简化了这一任务。Javadoc 使用特殊格式的文档注释（通常称为文档注释）从源代码自动生成 API 文档。

While the doc comment conventions are not officially part of the language, they constitute a de facto API that every Java programmer should know. These conventions are described in the How to Write Doc Comments web page [Javadoc-guide]. While this page has not been updated since Java 4 was released, it is still an invaluable resource. One important doc tag was added in Java 9, {@index}; one in Java 8, {@implSpec}; and two in Java 5, {@literal} and {@code}. These tags are missing from the aforementioned web page, but are discussed in this item.

虽然文档注释约定不是正式语言的一部分，但它们实际上构成了每个 Java 程序员都应该知道的 API。这些约定在如何编写文档注释的 web 页面 [Javadoc-guide] 中进行了描述。虽然自 Java 4 发布以来这个页面没有更新，但它仍然是一个非常宝贵的资源。在 Java 9 中添加了一个重要的文档标签，`{@index}`；Java 8 有一个重要标签，`{@implSpec}`；Java 5 中有两个重要标签，`{@literal}` 和 `{@code}`。上述 web 页面中缺少这些标签，但将在本项目中讨论。

**To document your API properly, you must precede every exported class, interface, constructor, method, and field declaration with a doc comment.** If a class is serializable, you should also document its serialized form (Item 87). In the absence of a doc comment, the best that Javadoc can do is to reproduce the declaration as the sole documentation for the affected API element. It is frustrating and error-prone to use an API with missing documentation comments. Public classes should not use default constructors because there is no way to provide doc comments for them. To write maintainable code, you should also write doc comments for most unexported classes, interfaces, constructors, methods, and fields, though these comments needn’t be as thorough as those for exported API elements.

**要正确地编写 API 文档，必须在每个公开的类、接口、构造函数、方法和字段声明之前加上文档注释。** 如果一个类是可序列化的，还应该记录它的序列化形式（Item-87）。在缺少文档注释的情况下，Javadoc 所能做的最好的事情就是重新生成该声明，作为受影响的 API 元素的唯一文档。使用缺少文档注释的 API 是令人沮丧和容易出错的。公共类不应该使用默认构造函数，因为无法为它们提供文档注释。要编写可维护的代码，还应该为大多数未公开的类、接口、构造函数、方法和字段编写文档注释，尽管这些注释不需要像公开 API 元素那样完整。

**The doc comment for a method should describe succinctly the contract between the method and its client.** With the exception of methods in classes designed for inheritance (Item 19), the contract should say what the method does rather than how it does its job. The doc comment should enumerate all of the method’s preconditions, which are the things that have to be true in order for a client to invoke it, and its postconditions, which are the things that will be true after the invocation has completed successfully. Typically, preconditions are described implicitly by the @throws tags for unchecked exceptions; each unchecked exception corresponds to a precondition violation. Also, preconditions can be specified along with the affected parameters in their @param tags.

**方法的文档注释应该简洁地描述方法与其客户端之间的约定。** 除了为继承而设计的类中的方法（Item-19），约定应该说明方法做什么，而不是它如何做它的工作。文档注释应该列举方法的所有前置条件（这些条件必须为真，以便客户端调用它们）和后置条件（这些条件是在调用成功完成后才为真）。通常，对于 unchecked 的异常，前置条件由 `@throw` 标记隐式地描述；每个 unchecked 异常对应于一个先决条件反例。此外，可以在前置条件及其 `@param` 标记中指定受影响的参数。

In addition to preconditions and postconditions, methods should document any side effects. A side effect is an observable change in the state of the system that is not obviously required in order to achieve the postcondition. For example, if a method starts a background thread, the documentation should make note of it.

除了前置条件和后置条件外，方法还应该文档中描述产生的任何副作用。副作用是系统状态的一个可观察到的变化，它不是实现后置条件所明显需要的。例如，如果一个方法启动了一个后台线程，文档应该说明。

To describe a method’s contract fully, the doc comment should have an @param tag for every parameter, an @return tag unless the method has a void return type, and an @throws tag for every exception thrown by the method, whether checked or unchecked (Item 74). If the text in the @return tag would be identical to the description of the method, it may be permissible to omit it, depending on the coding standards you are following.

要完整地描述方法的约定，文档注释应该为每个参数设置一个 `@param` 标记和一个 `@return` 标记（除非方法返回类型是 void），以及一个 `@throw` 标记（对于方法抛出的每个异常，无论 checked 或 unchecked）（Item-74。如果 `@return` 标记中的文本与方法的描述相同，则可以忽略它，这取决于你所遵循的标准。

By convention, the text following an @param tag or @return tag should be a noun phrase describing the value represented by the parameter or return value. Rarely, arithmetic expressions are used in place of noun phrases; see BigInteger for examples. The text following an @throws tag should consist of the word “if,” followed by a clause describing the conditions under which the exception is thrown. By convention, the phrase or clause following an @param, @return, or @throws tag is not terminated by a period. All of these conventions are illustrated by the following doc comment:

按照惯例，`@param` 标记或 `@return` 标记后面的文本应该是一个名词短语，描述参数或返回值所表示的值。算术表达式很少用来代替名词短语；有关示例，请参见 BigInteger。`@throw` 标记后面的文本应该包含单词「if」，后面跟着一个描述抛出异常的条件的子句。按照惯例，`@param`、`@return` 或 `@throw` 标记后面的短语或子句不以句号结束。以下的文档注释展示了所有这些约定：

```java
/**
* Returns the element at the specified position in this list.
**
<p>This method is <i>not</i> guaranteed to run in constant
* time. In some implementations it may run in time proportional
* to the element position.
**
@param index index of element to return; must be
* non-negative and less than the size of this list
* @return the element at the specified position in this list
* @throws IndexOutOfBoundsException if the index is out of range
* ({@code index < 0 || index >= this.size()})
*/
E get(int index);
```

Notice the use of HTML tags in this doc comment (&lt;p&gt; and &lt;i&gt;). The Javadoc utility translates doc comments into HTML, and arbitrary HTML elements in doc comments end up in the resulting HTML document. Occasionally, programmers go so far as to embed HTML tables in their doc comments, although this is rare.

注意，在这个文档注释中使用 HTML 标签（`<p>` 和 `<i>`）。Javadoc 实用程序将文档注释转换为 HTML，文档注释中的任意 HTML 元素最终会出现在生成的 HTML 文档中。有时候，程序员甚至会在他们的文档注释中嵌入 HTML 表，尽管这种情况很少见。

Also notice the use of the Javadoc {@code} tag around the code fragment in the @throws clause. This tag serves two purposes: it causes the code fragment to be rendered in code font, and it suppresses processing of HTML markup and nested Javadoc tags in the code fragment. The latter property is what allows us to use the less-than sign (<) in the code fragment even though it’s an HTML metacharacter. To include a multiline code example in a doc comment, use a Javadoc {@code} tag wrapped inside an HTML &lt;pre&gt; tag. In other words, precede the code example with the characters &lt;pre&gt;{@code and follow it with }&lt;/pre&gt;. This preserves line breaks in the code, and eliminates the need to escape HTML metacharacters, but not the at sign (@), which must be escaped if the code sample uses annotations.

还要注意在 `@throw` 子句中的代码片段周围使用 Javadoc 的 `{@code}` 标记。这个标记有两个目的：它使代码片段以代码字体呈现，并且它抑制了代码片段中 HTML 标记和嵌套 Javadoc 标记的处理。后一个属性允许我们在代码片段中使用小于号 `(<)`，即使它是一个 HTML 元字符。要在文档注释中包含多行代码，请将其包装在 `<pre>` 标签中。换句话说，在代码示例之前加上字符 `<pre>{@code}</pre>`。这保留了代码中的换行符，并消除了转义 HTML 元字符的需要，但不需要转义 at 符号 `(@)`，如果代码示例使用注释，则必须转义 at 符号 `(@)`。

Finally, notice the use of the words “this list” in the doc comment. By convention, the word “this” refers to the object on which a method is invoked when it is used in the doc comment for an instance method.

最后，请注意文档注释中使用的单词「this list」。按照惯例，「this」指的是调用实例方法的对象。

As mentioned in Item 15, when you design a class for inheritance, you must document its self-use patterns, so programmers know the semantics of overriding its methods. These self-use patterns should be documented using the @implSpec tag, added in Java 8. Recall that ordinary doc comments describe the contract between a method and its client; @implSpec comments, by contrast, describe the contract between a method and its subclass, allowing subclasses to rely on implementation behavior if they inherit the method or call it via super. Here's how it looks in practice:

正如 Item-15 中提到的，当你为继承设计一个类时，你必须记录它的自用模式，以便程序员知道覆盖它的方法的语义。这些自用模式应该使用在 Java 8 中添加的 `@implSpec` 标记来记录。回想一下，普通的文档注释描述了方法与其客户机之间的约定；相反，`@implSpec` 注释描述了方法与其子类之间的约定，允许子类依赖于实现行为（如果它们继承了方法或通过 super 调用方法）。下面是它在实际使用时的样子：

```java
/**
* Returns true if this collection is empty.
**
@implSpec
* This implementation returns {@code this.size() == 0}.
**
@return true if this collection is empty
*/
public boolean isEmpty() { ... }
```

As of Java 9, the Javadoc utility still ignores the @implSpec tag unless you pass the command line switch -tag "implSpec: a :Implementation Requirements:". Hopefully this will be remedied in a subsequent release.

从 Java 9 开始，Javadoc 实用程序仍然忽略 `@implSpec` 标记，除非你通过命令行开关 `-tag "implSpec: a :Implementation Requirements:"`。希望在后续的版本中可以纠正这个错误。

Don’t forget that you must take special action to generate documentation that contains HTML metacharacters, such as the less-than sign (<), the greater-than sign (>), and the ampersand (&). The best way to get these characters into documentation is to surround them with the {@literal} tag, which suppress processing of HTML markup and nested Javadoc tags. It is like the {@code} tag, except that it doesn’t render the text in code font. For example, this Javadoc fragment:

不要忘记，你必须采取特殊的操作来生成包含 HTML 元字符的文档，比如小于号 `(<)`、大于号 `(>)`、与号 `(&)`。将这些字符放到文档中最好的方法是用 `{@literal}` 标记包围它们，这将抑制 HTML 标记和嵌套 Javadoc 标记的处理。它类似于 `{@code}` 标记，只是它不以代码字体呈现文本。例如，这个 Javadoc 片段：

```java
* A geometric series converges if {@literal |r| < 1}.
```

generates the documentation: “A geometric series converges if |r| < 1.” The {@literal} tag could have been placed around just the less-than sign rather than the entire inequality with the same resulting documentation, but the doc comment would have been less readable in the source code. This illustrates the general principle that **doc comments should be readable both in the source code and in the generated documentation.** If you can’t achieve both, the readability of the generated documentation trumps that of the source code.

生成文档:「如果 |r| < 1，则几何级数收敛。」`{@literal}` 标签可以放在小于号周围，而不是整个不等式周围，得到的文档是相同的，但是文档注释在源代码中可读性会更差。这说明了 **一条原则，文档注释应该在源代码和生成的文档中都具备可读性。** 如果不能同时实现这两个目标，要保证生成的文档的可读性超过源代码的可读性。

The first “sentence” of each doc comment (as defined below) becomes the summary description of the element to which the comment pertains. For example, the summary description in the doc comment on page 255 is “Returns the element at the specified position in this list.” The summary description must stand on its own to describe the functionality of the element it summarizes. To avoid confusion, **no two members or constructors in a class or interface should have the same summary description.** Pay particular attention to overloadings, for which it is often natural to use the same first sentence (but unacceptable in doc comments).

每个文档注释的第一个「句子」（定义如下）成为注释所属元素的摘要描述。例如，255 页文档注释中的摘要描述是「返回列表中指定位置的元素」。摘要描述必须独立地描述它总结的元素的功能。为了避免混淆，**类或接口中的任何两个成员或构造函数都不应该具有相同的摘要描述。** 特别注意重载，对于重载，使用相同的摘要描述是很正常的（但在文档注释中是不可接受的）。

Be careful if the intended summary description contains a period, because the period can prematurely terminate the description. For example, a doc comment that begins with the phrase “A college degree, such as B.S., M.S. or Ph.D.” will result in the summary description “A college degree, such as B.S., M.S.” The problem is that the summary description ends at the first period that is followed by a space, tab, or line terminator (or at the first block tag) [Javadoc-ref]. Here, the second period in the abbreviation “M.S.” is followed by a space. The best solution is to surround the offending period and any associated text with an {@literal} tag, so the period is no longer followed by a space in the source code:

如果预期的摘要描述包含句点，请小心，因为句点可能会提前终止描述。例如，以「A college degree, such as B.S., M.S. or Ph.D.」开头的文档注释，会产生这样的概要描述「A college degree, such as B.S., M.S.」，问题在于，摘要描述在第一个句点结束，然后是空格、制表符或行结束符（或第一个块标记）[Javadoc-ref]。在这种情况下，缩写「M.S.」中的第二个句点就要接着用一个空格。最好的解决方案是用 `{@literal}` 标记来包围不当的句点和任何相关的文本，这样源代码中的句点后面就不会有空格了：

```java
/**
* A college degree, such as B.S., {@literal M.S.} or Ph.D.
*/
public class Degree { ... }
```

It is a bit misleading to say that the summary description is the first sentence in a doc comment. Convention dictates that it should seldom be a complete sentence. For methods and constructors, the summary description should be a verb phrase (including any object) describing the action performed by the method. For example:

将摘要描述说成是是文档注释中的第一句话有点误导人。按照惯例，它通常不是一个完整的句子。对于方法和构造函数，摘要描述应该是一个动词短语（包括任何对象），描述方法执行的动作。例如：

- ArrayList(int initialCapacity)—Constructs an empty list with the specified initial capacity.

构造具有指定初始容量的空 List。

- Collection.size()—Returns the number of elements in this collection.

返回此集合中的元素数量。

As shown in these examples, use the third person declarative tense (“returns the number”) rather than the second person imperative (“return the number”).

如这些例子所示，应使用第三人称陈述句时态「returns the number」而不是第二人称祈使句「return the number」。

For classes, interfaces, and fields, the summary description should be a noun phrase describing the thing represented by an instance of the class or interface or by the field itself. For example:

对于类、接口和字段，摘要描述应该是一个名词短语，描述由类或接口的实例或字段本身表示的事物。例如：

- Instant—An instantaneous point on the time-line.

时间线上的瞬时点。

- Math.PI—The double value that is closer than any other to pi, the ratio of the circumference of a circle to its diameter.

这个 double 类型的值比任何其它值的都更接近于圆周率（圆周长与直径之比）。

In Java 9, a client-side index was added to the HTML generated by Javadoc. This index, which eases the task of navigating large API documentation sets, takes the form of a search box in the upper-right corner of the page. When you type into the box, you get a drop-down menu of matching pages. API elements, such as classes, methods, and fields, are indexed automatically. Occasionally you may wish to index additional terms that are important to your API. The {@index} tag was added for this purpose. Indexing a term that appears in a doc comment is as simple as wrapping it in this tag, as shown in this fragment:

在 Java 9 中，客户端索引被添加到 Javadoc 生成的 HTML 中。这个索引以页面右上角的搜索框的形式出现，它简化了导航大型 API 文档集的任务。当你在框中键入时，你将得到一个匹配页面的下拉菜单。API 元素（如类、方法和字段）是自动索引的。有时，你可能希望索引 API 中很重要的术语。为此添加了 `{@index}` 标记。对文档注释中出现的术语进行索引，就像将其包装在这个标签中一样简单，如下面的片段所示：

```java
* This method complies with the {@index IEEE 754} standard.
```

Generics, enums, and annotations require special care in doc comments. **When documenting a generic type or method, be sure to document all type parameters:**

泛型、枚举和注解在文档注释中需要特别注意。**为泛型类型或方法编写文档时，请确保说明所有类型参数:**

```java
/**
* An object that maps keys to values. A map cannot contain
* duplicate keys; each key can map to at most one value.
**
(Remainder omitted)
**
@param <K> the type of keys maintained by this map
* @param <V> the type of mapped values
*/
public interface Map<K, V> { ... }
```

**When documenting an enum type, be sure to document the constants** as well as the type and any public methods. Note that you can put an entire doc comment on one line if it’s short:

**编写枚举类型的文档时，一定要说明常量** 以及类型、任何公共方法。注意，如果文档很短，你可以把整个文档注释放在一行：

```java
/**
* An instrument section of a symphony orchestra.
*/
public enum OrchestraSection {
/** Woodwinds, such as flute, clarinet, and oboe. */
WOODWIND,
/** Brass instruments, such as french horn and trumpet. */
BRASS,
/** Percussion instruments, such as timpani and cymbals. */
PERCUSSION,
/** Stringed instruments, such as violin and cello. */
STRING;
}
```

**When documenting an annotation type, be sure to document any Members** as well as the type itself. Document members with noun phrases, as if they were fields. For the summary description of the type, use a verb phrase that says what it means when a program element has an annotation of this type:

**为注释类型的文档时，请确保说明全部成员** 以及类型本身。用名词短语描述成员，就当它们是字段一样。对于类型的摘要描述，请使用动词短语，它表示当程序元素具有此类注解时的含义：

```java
/**
* Indicates that the annotated method is a test method that
* must throw the designated exception to pass.
*/
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExceptionTest {
/**
* The exception that the annotated test method must throw
* in order to pass. (The test is permitted to throw any
* subtype of the type described by this class object.)
*/
Class<? extends Throwable> value();
}
```

Package-level doc comments should be placed in a file named package-info.java. In addition to these comments, package-info.java must contain a package declaration and may contain annotations on this declaration. Similarly, if you elect to use the module system (Item 15), module-level comments should be placed in the module-info.java file.

包级别的文档注释应该放在名为 package info.java 的文件中。除了这些注释之外，package info.java 必须包含一个包声明，并且可能包含关于这个声明的注释。类似地，如果你选择使用模块系统（Item-15），模块级别的注释应该放在 module-info.java 文件中。

Two aspects of APIs that are often neglected in documentation are threadsafety and serializability. **Whether or not a class or static method is threadsafe, you should document its thread-safety** level, as described in Item 82. If a class is serializable, you should document its serialized form, as described in Item 87.

在文档中经常忽略的 API 的两个方面是线程安全性和可序列化性。**无论类或静态方法是否线程安全，你都应该说明它的线程安全级别**，如 Item-82 所述。如果一个类是可序列化的，你应该说明它的序列化形式，如 Item-87 中所述。

Javadoc has the ability to “inherit” method comments. If an API element does not have a doc comment, Javadoc searches for the most specific applicable doc comment, giving preference to interfaces over superclasses. The details of the search algorithm can be found in The Javadoc Reference Guide [Javadoc-ref]. You can also inherit parts of doc comments from supertypes using the {@inheritDoc} tag. This means, among other things, that classes can reuse doc comments from interfaces they implement, rather than copying these comments. This facility has the potential to reduce the burden of maintaining multiple sets of nearly identical doc comments, but it is tricky to use and has some limitations. The details are beyond the scope of this book.

Javadoc 具有「继承」方法注释的能力。如果 API 元素没有文档注释，Javadoc 将搜索最适用的文档注释，优先选择接口而不是超类。搜索算法的详细信息可以在《The Javadoc Reference Guide》 [Javadoc-ref] 中找到。你还可以使用 `{@inheritDoc}` 标记从超类型继承部分文档注释。这意味着类可以重用它们实现的接口中的文档注释，而不是复制这些注释。这个工具有能力减少维护多个几乎相同的文档注释集的负担，但是它使用起来很棘手，并且有一些限制。这些细节超出了这本书的范围。

One caveat should be added concerning documentation comments. While it is necessary to provide documentation comments for all exported API elements, it is not always sufficient. For complex APIs consisting of multiple interrelated classes, it is often necessary to supplement the documentation comments with an external document describing the overall architecture of the API. If such a document exists, the relevant class or package documentation comments should include a link to it.

关于文档注释，有一点需要特别注意。虽然有必要为所有公开的 API 元素提供文档注释，但这并不总是足够的。对于由多个相互关联的类组成的复杂 API，通常需要用描述 API 总体架构的外部文档来补充文档注释。如果存在这样的文档，相关的类或包文档注释应该包含到它的链接。

Javadoc automatically checks for adherence to many of the recommendations in this item. In Java 7, the command line switch -Xdoclint was required to get this behavior. In Java 8 and 9, checking is enabled by default. IDE plug-ins such as checkstyle go further in checking for adherence to these recommendations [Burn01]. You can also reduce the likelihood of errors in doc comments by running the HTML files generated by Javadoc through an HTML validity checker. This will detect many incorrect uses of HTML tags. Several such checkers are available for download, and you can validate HTML on the web using the W3C markup validation service [W3C-validator]. When validating generated HTML, keep in mind that as of Java 9, Javadoc is capable of generating HTML5 as well as HTML 4.01, though it still generates HTML 4.01 by default. Use the -html5 command line switch if you want Javadoc to generate HTML5.

Javadoc 会自动检查文档是否符合本项目中提及的许多建议。在 Java 7 中，需要命令行开关 `-Xdoclint` 来获得这种特性。在 Java 8 和 Java 9 中，默认情况下启用了该机制。诸如 checkstyle 之类的 IDE 插件在检查是否符合这些建议方面做得更好 [Burn01]。还可以通过 HTML 有效性检查器运行 Javadoc 生成的 HTML 文件来降低文档注释中出现错误的可能性。这将检测 HTML 标记的许多不正确用法。有几个这样的检查器可供下载，你可以使用 W3C 标记验证服务 [W3C-validator] 在 web 上验证 HTML。在验证生成的 HTML 时，请记住，从 Java 9 开始，Javadoc 就能够生成 HTML 5 和 HTML 4.01，尽管默认情况下它仍然生成 HTML 4.01。如果希望 Javadoc 生成 HTML5，请使用 `-html5` 命令行开关。

The conventions described in this item cover the basics. Though it is fifteen years old at the time of this writing, the definitive guide to writing doc comments is still How to Write Doc Comments [Javadoc-guide]. If you adhere to the guidelines in this item, the generated documentation should provide a clear description of your API. The only way to know for sure, however, is to **read the web pages generated by the Javadoc utility.** It is worth doing this for every API that will be used by others. Just as testing a program almost inevitably results in some changes to the code, reading the documentation generally results in at least a few minor changes to the doc comments.

本条目中描述的约定涵盖了基本内容。尽管撰写本文时已经有 15 年的历史，但编写文档注释的最终指南仍然是《How to Write Doc Comments》[Javadoc-guide]。如果你遵循本条目中的指导原则，生成的文档应该提供对 API 的清晰描述。然而，唯一确定的方法是 **读取 Javadoc 实用程序生成的 web 页面。** 对于其他人将使用的每个 API 都值得这样做。正如测试程序几乎不可避免地会导致对代码的一些更改一样，阅读文档通常也会导致对文档注释的一些较小更改。

To summarize, documentation comments are the best, most effective way to document your API. Their use should be considered mandatory for all exported API elements. Adopt a consistent style that adheres to standard conventions. Remember that arbitrary HTML is permissible in documentation comments and that HTML metacharacters must be escaped.

总之，文档注释是记录 API 的最佳、最有效的方法。应该认为，所有公开的 API 元素都必须使用文档注释，并采用符合标准约定的统一样式。请记住，在文档注释中允许使用任意 HTML 标签，并且必须转义 HTML 元字符。
