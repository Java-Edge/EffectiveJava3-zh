# 第 4 章 类和接口

## 【15】尽量减少类和成员的可访问性

> Minimize the accessibility of classes and members

The single most important factor that distinguishes（vt/vi. 区别，区分；辨别） a well-designed component from a poorly designed one is the degree to which the component hides its internal data and other implementation details from other components. A welldesigned component hides all its implementation details, cleanly separating its API from its implementation. Components then communicate only through their APIs and are oblivious to each others’ inner workings. This concept, known as information hiding or encapsulation, is a fundamental tenet of software design [Parnas72].

> 将设计良好的组件与设计糟糕的组件区别开来的最重要的因素是组件对其他组件隐藏内部数据和其他实现细节的程度。设计良好的组件隐藏了所有实现细节，干净地将 API 与实现分离。然后组件只通过它们的 api 进行通信，而不知道彼此的内部工作方式。这个概念被称为信息隐藏或封装，是软件设计的基本原则 [Parnas72]。

Information hiding is important for many reasons, most of which stem from the fact that it decouples（解耦） the components that comprise a system, allowing them to be developed, tested, optimized, used, understood, and modified in isolation（n. 隔离；孤立）.This speeds up system development because components can be developed in parallel（n. 平行线；对比 adj. 平行的；类似的，相同的 vt. 使…与…平行）. It eases（简化了） the burden（n. 负担；责任；vt. 使负担；烦扰） of maintenance（n. 维护，维修；保持） because components can be understood more quickly and debugged or replaced with little fear of harming other components. While information hiding does not, in and of itself, cause good performance, it enables effective performance tuning: once a system is complete and profiling（剖析） has determined which components are causing performance problems (Item 67), those components can be optimized without affecting the correctness of others. Information hiding increases software reuse because components that aren’t tightly coupled often prove useful in other contexts besides the ones for which they were developed. Finally, information hiding decreases the risk in building large systems because individual components may prove successful even if the system does not.

> 由于许多原因，信息隐藏是重要的，其中大部分原因源于这样一个事实：它解耦了组成系统的组件，允许它们被单独开发、测试、优化、使用、理解和修改。这加速了系统开发，因为组件可以并行开发。它减轻了维护的负担，因为组件可以被更快地理解、调试或替换，而不必担心会损害其他组件。虽然信息隐藏本身不会导致良好的性能，但它能够进行有效的性能调优：一旦系统完成，概要分析确定了哪些组件会导致性能问题（Item-67），就可以在不影响其他组件正确性的情况下对这些组件进行优化。信息隐藏增加了软件的重用性，因为没有紧密耦合的组件通常在其他上下文中被证明是有用的，除了开发它们的上下文。最后，信息隐藏降低了构建大型系统的风险，因为即使系统没有成功，单个组件也可能被证明是成功的。

Java has many facilities to aid in information hiding. The access control mechanism [JLS, 6.6] specifies the accessibility of classes, interfaces, and members. The accessibility of an entity is determined by the location of its declaration and by which, if any, of the access modifiers (private,protected, and public) is present on the declaration. Proper use of these modifiers is essential to information hiding.

> Java 有许多工具来帮助隐藏信息。访问控制机制 [JLS, 6.6] 指定了类、接口和成员的可访问性。实体的可访问性由其声明的位置决定，如果有的话，则由声明中显示的访问修饰符（私有、受保护和公共）决定。正确使用这些修饰词是信息隐藏的关键。

The rule of thumb is simple: make each class or member as inaccessible as possible. In other words, use the lowest possible access level consistent with the proper functioning of the software that you are writing.

> 经验法则很简单：让每个类或成员尽可能不可访问。换句话说，使用与你正在编写的软件的适当功能一致的尽可能低的访问级别。

For top-level (non-nested) classes and interfaces, there are only two possible access levels: package-private and public. If you declare a top-level class or interface with the public modifier, it will be public; otherwise, it will be package-private. If a top-level class or interface can be made package-private, it should be. By making it package-private, you make it part of the implementation rather than the exported API, and you can modify it, replace it, or eliminate it in a subsequent release without fear of harming existing clients. If you make it public, you are obligated to support it forever to maintain compatibility.

> 对于顶级（非嵌套）类和接口，只有两个可能的访问级别：包私有和公共。如果声明一个顶级类或与公共修饰符的接口，它将是公共的；否则，它将是包私有的。如果顶级类或接口可以使包私有，那么它应该是私有的。通过使其包私有，你使其成为实现的一部分，而不是导出的 API，你可以在后续版本中修改、替换或消除它，而不必担心损害现有客户端。如果你将其公开，你有义务永远支持它以保持兼容性。

If a package-private top-level class or interface is used by only one class,consider making the top-level class a private static nested class of the sole class that uses it (Item 24). This reduces its accessibility from all the classes in its package to the one class that uses it. But it is far more important to reduce the accessibility of a gratuitously public class than of a package-private top-level class: the public class is part of the package’s API, while the package-private top-level class is already part of its implementation.

> 如果包私有顶级类或接口只被一个类使用，那么考虑将顶级类设置为使用它的唯一类的私有静态嵌套类（Item-24）。这降低了它从包中的所有类到使用它的类的可访问性。但是，减少免费公共类的可访问性比减少包-私有顶级类的可访问性重要得多：公共类是包的 API 的一部分，而包-私有顶级类已经是包的实现的一部分。

For members (fields, methods, nested classes, and nested interfaces), there are four possible access levels, listed here in order of increasing accessibility:

> 对于成员（字段、方法、嵌套类和嵌套接口），有四个可能的访问级别，这里列出了增加可访问性的顺序：

- **private** —The member is accessible only from the top-level class where it is declared.

> 私有，成员只能从声明它的顶级类中访问。

- **package-private** —The member is accessible from any class in the package where it is declared. Technically known as default access, this is the access level you get if no access modifier is specified (except for interface members,which are public by default).

> 包级私有，成员可以从包中声明它的任何类访问。技术上称为默认访问，如果没有指定访问修饰符（接口成员除外，默认情况下，接口成员是公共的），就会得到这个访问级别。

- **protected** —The member is accessible from subclasses of the class where it is declared (subject to a few restrictions [JLS, 6.6.2]) and from any class in the package where it is declared.

> 保护，成员可以从声明它的类的子类（受一些限制 [JLS, 6.6.2])和包中声明它的任何类访问。

- **public** —The member is accessible from anywhere.

> 公共，该成员可以从任何地方访问。

After carefully designing your class’s public API, your reflex（n. 反射；反映；映像；回复；习惯性思维 adj. 反射的；反省的；反作用的） should be to make all other members private. Only if another class in the same package really needs to access a member should you remove the private modifier, making the member package-private. If you find yourself doing this often, you should reexamine（重新审视） the design of your system to see if another decomposition（n. 分解，腐烂；变质） might yield classes that are better decoupled from one another. That said, both private and package-private members are part of a class’s implementation and do not normally impact its exported API. These fields can, however, “leak” into the exported API if the class implements Serializable (Items 86 and 87).

> 在仔细设计了类的公共 API 之后，你的反射应该是使所有其他成员都是私有的。只有当同一包中的另一个类确实需要访问一个成员时，你才应该删除私有修饰符，使成员包成为私有的。如果你发现自己经常这样做，那么你应该重新检查系统的设计，看看另一个分解是否会产生更好地相互分离的类。也就是说，私有成员和包私有成员都是类实现的一部分，通常不会影响其导出的 API。但是，如果类实现了 Serializable（Item-86 和 Item-87），这些字段可能会「泄漏」到导出的 API 中。

For members of public classes, a huge increase in accessibility occurs when the access level goes from package-private to protected. A protected member is part of the class’s exported API and must be supported forever. Also, a protected member of an exported class represents a public commitment to an implementation detail (Item 19). The need for protected members should be relatively rare.

> 对于公共类的成员来说，当访问级别从包私有到受保护时，可访问性会有很大的提高。受保护的成员是类导出 API 的一部分，必须永远支持。此外，导出类的受保护成员表示对实现细节的公开承诺（Item-19）。对受保护成员的需求应该相对较少。

There is a key rule that restricts your ability to reduce the accessibility of methods. If a method overrides a superclass method, it cannot have a more restrictive access level in the subclass than in the superclass [JLS, 8.4.8.3]. This is necessary to ensure that an instance of the subclass is usable anywhere that an instance of the superclass is usable (the Liskov substitution principle, see Item15). If you violate this rule, the compiler will generate an error message when you try to compile the subclass. A special case of this rule is that if a class implements an interface, all of the class methods that are in the interface must be declared public in the class.

> 有一个关键规则限制了你减少方法可访问性的能力。如果一个方法覆盖了超类方法，那么它在子类中的访问级别就不能比在超类 [JLS, 8.4.8.3] 中更严格。这对于确保子类的实例在超类的实例可用的任何地方都可用是必要的（Liskov 替换原则，请参阅 Item-15）。如果违反此规则，编译器将在尝试编译子类时生成错误消息。这个规则的一个特殊情况是，如果一个类实现了一个接口，那么该接口中的所有类方法都必须在类中声明为 public。

To facilitate（vt. 促进；帮助；使容易） testing your code, you may be tempted to make a class, interface, or member more accessible than otherwise necessary. This is fine up to a point. It is acceptable to make a private member of a public class package-private in order to test it, but it is not acceptable to raise the accessibility any higher. In other words, it is not acceptable to make a class, interface, or member a part of a pack-age’s exported API to facilitate testing. Luckily, it isn’t necessary either because tests can be made to run as part of the package being tested, thus gaining access to its package-private elements.

> 为了便于测试代码，你可能会倾向于使类、接口或成员比其他需要更容易访问。这在一定程度上是好的。为了测试一个公共类包的私有成员是可以接受的，但是提高可访问性是不可接受的。换句话说，将类、接口或成员作为包时代导出的 API 的一部分以方便测试是不可接受的。幸运的是，也没有必要这样做，因为测试可以作为测试包的一部分运行，从而获得对包私有元素的访问权。

**Instance fields of public classes should rarely be public** (Item 16). If an instance field is nonfinal or is a reference to a mutable object, then by making it public, you give up the ability to limit the values that can be stored in the field.This means you give up the ability to enforce invariants involving the field.Also, you give up the ability to take any action when the field is modified, so **classes with public mutable fields are not generally thread-safe.** Even if a field is final and refers to an immutable object, by making it public you give up the flexibility to switch to a new internal data representation in which the field does not exist.

> **公共类的实例字段很少是公共的**（Item-16）。如果实例字段是非 final 的，或者是对可变对象的引用，那么通过将其公开，你就放弃了限制字段中可以存储的值的能力。这意味着你放弃了强制包含字段的不变量的能力。此外，你还放弃了在修改字段时采取任何操作的能力，因此带有公共可变字段的 **类通常不是线程安全的。** 即使一个字段是 final 的，并且引用了一个不可变的对象，通过将其公开，你放弃了切换到一个新的内部数据表示的灵活性，而该字段并不存在。

The same advice applies to static fields, with one exception. You can expose constants via public static final fields, assuming the constants form an integral part of the abstraction provided by the class. By convention, such fields have names consisting of capital letters, with words separated by underscores (Item 68). It is critical that these fields contain either primitive values or references to immutable objects (Item 17). a field containing a reference to a mutable object has all the disadvantages of a nonfinal field. While the reference cannot be modified, the referenced object can be modified—with disastrous results.

> 同样的建议也适用于静态字段，只有一个例外。你可以通过公共静态 final 字段公开常量，假设这些常量是类提供的抽象的组成部分。按照惯例，这些字段的名称由大写字母组成，单词以下划线分隔（Item-68）。重要的是，这些字段要么包含原始值，要么包含对不可变对象的引用（Item-17）。包含对可变对象的引用的字段具有非 final 字段的所有缺点。虽然引用不能被修改，但是引用的对象可以被修改——这会导致灾难性的后果。

Note that a nonzero-length array is always mutable, so it is wrong for a class to have a public static final array field, or an accessor that returns such a field. If a class has such a field or accessor, clients will be able to modify the contents of the array. This is a frequent source of security holes:

> 请注意，非零长度的数组总是可变的，因此对于类来说，拥有一个公共静态 final 数组字段或返回该字段的访问器是错误的。如果一个类具有这样的字段或访问器，客户端将能够修改数组的内容。这是一个常见的安全漏洞来源：

```java
// Potential security hole!
public static final Thing[] VALUES = { ... };
```

Beware of the fact that some IDEs generate accessors that return references to private array fields, resulting in exactly this problem. There are two ways to fix the problem. You can make the public array private and add a public immutable list:

> 要注意的是，一些 IDE 生成了返回私有数组字段引用的访问器，这恰恰导致了这个问题。有两种方法可以解决这个问题。你可以将公共数组设置为私有，并添加一个公共不可变列表：

```java
private static final Thing[] PRIVATE_VALUES = { ... };
public static final List<Thing> VALUES = Collections.unmodifiableList(Arrays.asList(PRIVATE_VALUES));
```

Alternatively, you can make the array private and add a public method that returns a copy of a private array:

> 或者，你可以将数组设置为私有，并添加一个返回私有数组副本的公共方法：

```java
private static final Thing[] PRIVATE_VALUES = { ... };
public static final Thing[] values() {
    return PRIVATE_VALUES.clone();
}
```

To choose between these alternatives, think about what the client is likely to do with the result. Which return type will be more convenient? Which will give better performance?

> 要在这些备选方案中进行选择，请考虑客户可能会如何处理结果。哪种返回类型更方便？哪种表现会更好？

As of Java 9, there are two additional, implicit access levels introduced as part of the module system. A module is a grouping of packages, like a package is a grouping of classes. A module may explicitly export some of its packages via export declarations in its module declaration (which is by convention contained in a source file named module-info.java). Public and protected members of unexported packages in a module are inaccessible outside the module; within the module, accessibility is unaffected by export declarations. Using the module system allows you to share classes among packages within a module without making them visible to the entire world. Public and protected members of public classes in unexported packages give rise to the two implicit access levels, which are intramodular analogues of the normal public and protected levels. The need for this kind of sharing is relatively rare and can often be eliminated by rearranging the classes within your packages.

> 对于 Java 9，作为模块系统的一部分，还引入了另外两个隐式访问级别。模块是包的分组，就像包是类的分组一样。模块可以通过模块声明中的导出声明显式地导出它的一些包（按照约定包含在名为 `module-info.java` 的源文件中）。模块中未导出包的公共成员和受保护成员在模块外不可访问;在模块中，可访问性不受导出声明的影响。通过使用模块系统，你可以在模块内的包之间共享类，而不会让整个世界看到它们。未导出包中的公共类和受保护的成员产生了两个隐式访问级别，它们是正常公共级别和受保护级别的内部类似物。这种共享的需求相对较少，通常可以通过重新安排包中的类来消除。

Unlike the four main access levels, the two module-based levels are largely advisory. If you place a module’s JAR file on your application’s class path instead of its module path, the packages in the module revert to their nonmodular behavior: all of the public and protected members of the packages’ public classes have their normal accessibility, regardless of whether the packages are exported by the module [Reinhold, 1.2]. The one place where the newly introduced access levels are strictly enforced is the JDK itself: the unexported packages in the Java libraries are truly inaccessible outside of their modules.

> 与四个主要的访问级别不同，这两个基于模块的级别在很大程度上是顾问级别。如果你把一个模块的 JAR 文件在你的应用程序的类路径中,而不是模块路径,包模块恢复到他们 nonmodular 行为：所有的公共成员和保护成员包的公共类正常的可访问性,不管模块导出的包 [Reinhold,1.2]。严格执行新引入的访问级别的一个地方是 JDK 本身：Java 库中未导出的包在其模块之外确实不可访问。

Not only is the access protection afforded by modules of limited utility to the typical Java programmer, and largely advisory in nature; in order to take advantage of it, you must group your packages into modules, make all of their dependencies explicit in module declarations, rearrange your source tree, and take special actions to accommodate any access to non-modularized packages from within your modules [Reinhold, 3]. It is too early to say whether modules will achieve widespread use outside of the JDK itself. In the meantime, it seems best to avoid them unless you have a compelling need.

> 对于典型的 Java 程序员来说，访问保护不仅是有限实用的模块所提供的，而且本质上是建议性的；为了利用它，你必须将包分组到模块中，在模块声明中显式地声明它们的所有依赖项，重新安排源代码树，并采取特殊操作以适应从模块中对非模块化包的任何访问 [Reinhold, 3]。现在说模块能否在 JDK 之外得到广泛使用还为时过早。与此同时，除非你有迫切的需求，否则最好还是避开它们。

To summarize, you should reduce accessibility of program elements as much as possible (within reason). After carefully designing a minimal public API, you should prevent any stray classes, interfaces, or members from becoming part of the API. With the exception of public static final fields, which serve as constants,public classes should have no public fields. Ensure that objects referenced by public static final fields are immutable.

> 总之，你应该尽可能减少程序元素的可访问性（在合理的范围内）。在仔细设计了一个最小的公共 API 之后，你应该防止任何游离的类、接口或成员成为 API 的一部分。除了作为常量的公共静态 final 字段外，公共类应该没有公共字段。确保公共静态 final 字段引用的对象是不可变的。

---

## 【16】在公共类中，使用访问器方法，而不是公共字段

> In public classes, use accessor methods, not public fields

Occasionally, you may be tempted to write degenerate classes that serve no purpose other than to group instance fields:

> 有时候，可能会编写一些退化类，这些类除了对实例字段进行分组之外，没有其他用途：

```java
// Degenerate classes like this should not be public!
class Point {
    public double x;
    public double y;
}
```

Because the data fields of such classes are accessed directly, these classes do not offer the benefits of encapsulation（n. 封装；包装） (Item 15). You can’t change the representation（n. 代表；表现；表示法；陈述） without changing the API, you can’t enforce invariants, and you can’t take auxiliary（adj. 辅助的；副的；附加的） action when a field is accessed. Hard-line object-oriented programmers feel that such classes are anathema（n. 诅咒；革出教门；被诅咒者；令人厌恶的人） and should always be replaced by classes with private fields and public accessor methods (getters) and, for mutable classes, mutators (setters):

> 因为这些类的数据字段是直接访问的，所以这些类没有提供封装的好处（Item-15）。不改变 API 就不能改变表现形式，不能实施不变量，也不能在访问字段时采取辅助操作。坚持面向对象思维的程序员会认为这样的类是令人厌恶的，应该被使用私有字段和公共访问方法 getter 的类所取代，对于可变类，则是赋值方法 setter：

```java
// Encapsulation of data by accessor methods and mutators
class Point {
    private double x;
    private double y;
    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }
    public double getX() { return x; }
    public double getY() { return y; }
    public void setX(double x) { this.x = x; }
    public void setY(double y) { this.y = y; }
}
```

Certainly, the hard-liners are correct when it comes to public classes: if a class is accessible outside its package, provide accessor methods to preserve the flexibility to change the class’s internal representation. If a public class exposes its data fields, all hope of changing its representation is lost because client code can be distributed far and wide.

> 当然，当涉及到公共类时，强硬派是正确的：如果类可以在包之外访问，那么提供访问器方法来保持更改类内部表示的灵活性。如果一个公共类公开其数据字段，那么改变其表示形式的所有希望都将落空，因为客户端代码可以广泛分发。

However, if a class is package-private or is a private nested class, there is nothing inherently wrong with exposing its data fields—assuming they do an adequate job of describing the abstraction provided by the class. This approach generates less visual clutter than the accessor-method approach, both in the class definition and in the client code that uses it. While the client code is tied to the class’s internal representation, this code is confined to the package containing the class. If a change in representation becomes desirable, you can make the change without touching any code outside the package. In the case of a private nested class, the scope of the change is further restricted to the enclosing class.

> 但是，如果一个类是包私有的或者是私有嵌套类，那么公开它的数据字段并没有什么本质上的错误——假设它们能够很好地描述类提供的抽象。无论是在类定义还是在使用它的客户端代码中，这种方法产生的视觉混乱都比访问方法少。虽然客户端代码与类的内部表示绑定在一起，但这段代码仅限于包含该类的包。如果想要对表示形式进行更改，你可以在不接触包外部任何代码的情况下进行更改。对于私有嵌套类，更改的范围进一步限制在封闭类中。

Several classes in the Java platform libraries violate the advice that public classes should not expose fields directly. Prominent examples include the Point and Dimension classes in the java.awt package. Rather than examples to be emulated, these classes should be regarded as cautionary tales. As described in Item 67, the decision to expose the internals of the Dimension class resulted in a serious performance problem that is still with us today.

> Java 库中的几个类违反了公共类不应该直接公开字段的建议。突出的例子包括 `java.awt` 包中的 Point 和 Dimension。这些类不应被效仿，而应被视为警示。正如 Item-67 所述，公开 Dimension 类的内部结构导致了严重的性能问题，这种问题至今仍存在。

While it’s never a good idea for a public class to expose fields directly, it is less harmful if the fields are immutable. You can’t change the representation of such a class without changing its API, and you can’t take auxiliary actions when a field is read, but you can enforce invariants. For example, this class guarantees that each instance represents a valid time:

> 虽然公共类直接公开字段从来都不是一个好主意，但是如果字段是不可变的，那么危害就会小一些。你不能在不更改该类的 API 的情况下更改该类的表现形式，也不能在读取字段时采取辅助操作，但是你可以实施不变量。例如，这个类保证每个实例代表一个有效的时间：

```java
// Public class with exposed immutable fields - questionable
public final class Time {
    private static final int HOURS_PER_DAY = 24;
    private static final int MINUTES_PER_HOUR = 60;
    public final int hour;
    public final int minute;

    public Time(int hour, int minute) {
        if (hour < 0 || hour >= HOURS_PER_DAY)
            throw new IllegalArgumentException("Hour: " + hour);
        if (minute < 0 || minute >= MINUTES_PER_HOUR)
            throw new IllegalArgumentException("Min: " + minute);
        this.hour = hour;
        this.minute = minute;
    } ... // Remainder omitted
}
```

In summary, public classes should never expose（vt. 揭露，揭发；使曝光；显示） mutable fields. It is less harmful, though still questionable（adj. 可疑的；有问题的）, for public classes to expose immutable fields. It is, however, sometimes desirable for package-private or private nested classes to expose fields, whether mutable or immutable.

> 总之，公共类不应该公开可变字段。对于公共类来说，公开不可变字段的危害要小一些，但仍然存在潜在的问题。然而，有时候包私有或私有嵌套类需要公开字段，无论这个类是可变的还是不可变的。

---

## 【17】减少可变性

> Minimize mutability

An immutable（adj. 不变的；不可变的；不能变的） class is simply a class whose instances cannot be modified（v. 修改；adj. 改进的，修改的）. All of the information contained in each instance is fixed for the lifetime of the object,so no changes can ever be observed. The Java platform libraries contain many immutable classes, including String, the boxed primitive classes, and BigInteger and BigDecimal. There are many good reasons for this:Immutable classes are easier to design, implement, and use than mutable classes.They are less prone（adj. 俯卧的；有…倾向的，易于…的） to error and are more secure.

> 不可变类就是一个实例不能被修改的类。每个实例中包含的所有信息在对象的生命周期内都是固定的，因此永远不会观察到任何更改。Java 库包含许多不可变的类，包括 String、基本数据类型的包装类、BigInteger 和 BigDecimal。有很多很好的理由：不可变类比可变类更容易设计、实现和使用。它们不太容易出错，而且更安全。

To make a class immutable, follow these five rules:

> 要使类不可变，请遵循以下 5 条规则：

1. **Don’t provide methods that modify the object’s state** (known as mutators).

> **不要提供修改对象状态的方法**（被称为赋值方法）

2. **Ensure that the class can’t be extended.** This prevents careless or malicious（adj. 恶意的；恶毒的；蓄意的；怀恨的） subclasses from compromising（adj. 妥协的；让步的） the immutable behavior of the class by behaving as if the object’s state has changed. Preventing subclassing is generally accomplished by making the class final, but there is an alternative that we’ll discuss later.

> **确保类不能被扩展。** 这可以防止粗心或恶意的子类以对象状态发生改变的方式行为，从而损害类的不可变行为。防止子类化通常通过使类成为 final 来完成，但是还有一种替代方法，我们将在后面讨论。

3. **Make all fields final.** This clearly expresses your intent in a manner that is enforced（v. 执行） by the system. Also, it is necessary to ensure correct behavior if a reference to a newly created instance is passed from one thread to another without synchronization, as spelled out in the memory model [JLS, 17.5;Goetz06, 16].

> **所有字段用 final 修饰。** 这清楚地表达了你的意图，方式是由系统执行的。同样，如果引用新创建的实例在没有同步的情况下从一个线程传递到另一个线程，那么就有必要确保正确的行为，就像内存模型中描述的那样 [JLS, 17.5;Goetz06, 16]。

4. **Make all fields private.** This prevents clients from obtaining access to mutable objects referred to by fields and modifying these objects directly.While it is technically permissible for immutable classes to have public final fields containing primitive values or references to immutable objects, it is not recommended because it precludes changing the internal representation in a later release (Items 15 and 16).

> **使所有字段为私有。** 这将阻止客户端访问字段引用的可变对象并直接修改这些对象。虽然在技术上允许不可变类拥有包含基元值或对不可变对象的引用的公共 final 字段，但不建议这样做，因为它排除了在以后的版本中更改内部表示（Item-15 和 Item-16）。

5. **Ensure exclusive access to any mutable components.** If your class has any fields that refer to mutable objects, ensure that clients of the class cannot obtain references to these objects. Never initialize such a field to a clientprovided object reference or return the field from an accessor. Make defensive copies (Item 50) in constructors, accessors, and readObject methods (Item 88).

> **确保对任何可变组件的独占访问。** 如果你的类有任何引用可变对象的字段，请确保该类的客户端无法获得对这些对象的引用。永远不要将这样的字段初始化为 clientprovide 对象引用或从访问器返回字段。在构造函数、访问器和 readObject 方法（Item-88）中创建防御性副本（Item-50）。

Many of the example classes in previous items are immutable. One such class is PhoneNumber in Item 11, which has accessors for each attribute but no corresponding mutators. Here is a slightly more complex example:

> 前面项目中的许多示例类都是不可变的。其中一个类是 Item-11 中的 PhoneNumber，它对每个属性都有访问器，但没有相应的赋值方法。下面是一个稍微复杂一点的例子：

```java
// Immutable complex number class
public final class Complex {
    private final double re;
    private final double im;

    public Complex(double re, double im) {
        this.re = re;
        this.im = im;
    }
    public double realPart() { return re; }
    public double imaginaryPart() { return im; }
    public Complex plus(Complex c) {
        return new Complex(re + c.re, im + c.im);
    }
    public Complex minus(Complex c) {
        return new Complex(re - c.re, im - c.im);
    }
    public Complex times(Complex c) {
        return new Complex(re * c.re - im * c.im,re * c.im + im * c.re);
    }
    public Complex dividedBy(Complex c) {
        double tmp = c.re * c.re + c.im * c.im;
        return new Complex((re * c.re + im * c.im) / tmp, (im * c.re - re * c.im) / tmp);
    }

    @Override public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Complex))
            return false;
        Complex c = (Complex) o;

        // See page 47 to find out why we use compare instead of ==
        return Double.compare(c.re, re) == 0
                && Double.compare(c.im, im) == 0;
    }

    @Override public int hashCode() {
        return 31 * Double.hashCode(re) + Double.hashCode(im);
    }

    @Override public String toString() {
        return "(" + re + " + " + im + "i)";
    }
}
```

This class represents a complex number (a number with both real and imaginary parts). In addition to the standard Object methods, it provides accessors for the real and imaginary parts and provides the four basic arithmetic operations: addition, subtraction, multiplication, and division. Notice how the arithmetic operations create and return a new Complex instance rather than modifying this instance. This pattern is known as the functional approach because methods return the result of applying a function to their operand,without modifying it. Contrast it to the procedural or imperative approach in which methods apply a procedure to their operand, causing its state to change.Note that the method names are prepositions (such as plus) rather than verbs (such as add). This emphasizes the fact that methods don’t change the values of the objects. The BigInteger and BigDecimal classes did not obey this naming convention, and it led to many usage errors.

> 这个类表示一个复数（一个包含实部和虚部的数）。除了标准的对象方法之外，它还为实部和虚部提供访问器，并提供四种基本的算术运算：加法、减法、乘法和除法。需要注意的是，算术操作如何创建和返回一个新的复杂实例，而不是修改这个实例。这种模式称为泛函方法，因为方法返回对其操作数应用函数的结果，而不修改它。将其与方法将过程应用于其操作数的过程或命令式方法进行对比，使其状态发生变化。注意，方法名是介词（如 plus)，而不是动词（如 add)。这强调了一个事实，方法不会改变对象的值。BigInteger 和 BigDecimal 类不遵守这个命名约定，导致了许多使用错误。

The functional approach（n. 方法；途径；接近） may appear unnatural if you’re not familiar（adj. 熟悉的；常见的；亲近的） with it,but it enables immutability, which has many advantages. **Immutable objects are simple.** An immutable object can be in exactly one state, the state in which it was created. If you make sure that all constructors establish class invariants, then it is guaranteed that these invariants will remain true for all time, with no further effort on your part or on the part of the programmer who uses the class. Mutable objects, on the other hand, can have arbitrarily complex state spaces. If the documentation does not provide a precise description of the state transitions performed by mutator methods, it can be difficult or impossible to use a mutable class reliably.

> 如果你不熟悉函数方法，那么它可能看起来不自然，但是它支持不变性，这有很多优点。**不可变对象很简单。** 一个不可变的对象可以恰好处于一种状态，即创建它的状态。如果你确保所有构造函数都建立了类不变量，那么就可以保证这些不变量将一直保持为真，而你和使用该类的程序员无需再做任何努力。另一方面，可变对象可以具有任意复杂的状态空间。如果文档没有提供 mutator 方法执行的状态转换的精确描述，那么可能很难或不可能可靠地使用可变类。

**Immutable objects are inherently thread-safe; they require no synchronization.** They cannot be corrupted by multiple threads accessing them concurrently. This is far and away the easiest approach to achieve thread safety.Since no thread can ever observe any effect of another thread on an immutable object, **immutable objects can be shared freely.** Immutable classes should therefore encourage clients to reuse existing instances wherever possible. One easy way to do this is to provide public static final constants for commonly used values. For example, the Complex class might provide these constants:

> 不可变对象本质上是线程安全的；它们不需要同步。它们不能被多线程并发地访问而损坏。这无疑是实现线程安全的最简单方法。由于任何线程都无法观察到另一个线程对不可变对象的任何影响，因此 **可以自由共享不可变对象。** 因此，不可变类应该鼓励客户尽可能重用现有的实例。一种简单的方法是为常用值提供公共静态最终常量。例如，复杂类可能提供以下常量：

```java
public static final Complex ZERO = new Complex(0, 0);
public static final Complex ONE = new Complex(1, 0);
public static final Complex I = new Complex(0, 1);
```

This approach can be taken one step further. An immutable class can provide static factories (Item 1) that cache frequently requested instances to avoid creating new instances when existing ones would do. All the boxed primitive classes and BigInteger do this. Using such static factories causes clients to share instances instead of creating new ones, reducing memory footprint and garbage collection costs. Opting for static factories in place of public constructors when designing a new class gives you the flexibility to add caching later, without modifying clients.

> 这种方法可以更进一步。不可变类可以提供静态工厂（Item-1），这些工厂缓存经常请求的实例，以避免在现有实例可用时创建新实例。所有包装类和 BigInteger 都是这样做的。使用这种静态工厂会导致客户端共享实例而不是创建新实例，从而减少内存占用和垃圾收集成本。在设计新类时，选择静态工厂而不是公共构造函数，这使你能够灵活地在以后添加缓存，而无需修改客户端。

A consequence（n. 结果；重要性；推论） of the fact that immutable objects can be shared freely is that you never have to make defensive copies of them (Item 50). In fact, you never have to make any copies at all because the copies would be forever equivalent to the originals. Therefore, you need not and should not provide a clone method or copy constructor (Item 13) on an immutable class. This was not well understood in the early days of the Java platform, so the String class does have a copy constructor, but it should rarely, if ever, be used (Item 6).

> 不可变对象可以自由共享这一事实的一个后果是，你永远不需要对它们进行防御性的复制（Item-50）。事实上，你根本不需要做任何拷贝，因为拷贝将永远等同于原件。因此，你不需要也不应该在不可变类上提供克隆方法或复制构造函数（Item-13）。这在 Java 平台的早期并没有得到很好的理解，因此 String 类确实有一个复制构造函数，但是如果有的话，应该很少使用它（Item-6）。

**Not only can you share immutable objects, but they can share their internals.** For example, the BigInteger class uses a sign-magnitude representation internally. The sign is represented by an int, and the magnitude is represented by an int array. The negate method produces a new BigInteger of like magnitude and opposite sign. It does not need to copy the array even though it is mutable; the newly created BigInteger points to the same internal array as the original.

> **你不仅可以共享不可变对象，而且可以共享它们的内部。** 例如，BigInteger 类在内部使用符号幅度表示。符号用 int 表示，星等用 int 数组表示。反求法产生了一个大小相同、符号相反的大整数。即使数组是可变的，它也不需要复制;新创建的 BigInteger 指向与原始的内部数组相同的内部数组。

**Immutable objects make great building blocks for other objects,** whether mutable or immutable. It’s much easier to maintain the invariants of a complex object if you know that its component objects will not change underneath it. A special case of this principle is that immutable objects make great map keys and set elements: you don’t have to worry about their values changing once they’re in the map or set, which would destroy the map or set’s invariants.

> **不可变对象是其他对象的很好的构建模块，** 无论是可变的还是不可变的。如果知道复杂对象的组件对象不会在其下面发生更改，那么维护复杂对象的不变性就会容易得多。这个原则的一个特殊情况是，不可变对象会生成很棒的 map 键和 set 元素：你不必担心它们的值在 map 或 set 中发生变化，这会破坏 map 或 set 的不变量。

**Immutable objects provide failure atomicity for free** (Item 76). Their state never changes, so there is no possibility of a temporary inconsistency.

> 不可变对象免费提供故障原子性（Item-76）。他们的状态从未改变，所以不可能出现暂时的不一致。

**The major disadvantage of immutable classes is that they require a separate object for each distinct value.** Creating these objects can be costly,especially if they are large. For example, suppose that you have a million-bit BigInteger and you want to change its low-order bit:

> 不可变类的主要缺点是每个不同的值都需要一个单独的对象。创建这些对象的成本可能很高，尤其是如果对象很大的话。例如，假设你有一个百万比特的大整数，你想改变它的低阶位：

```java
BigInteger moby = ...;
moby = moby.flipBit(0);
```

The flipBit method creates a new BigInteger instance, also a million bits long, that differs from the original in only one bit. The operation requires time and space proportional to the size of the BigInteger. Contrast this to java.util.BitSet. Like BigInteger, BitSet represents an arbitrarily long sequence of bits, but unlike BigInteger, BitSet is mutable. The BitSet class provides a method that allows you to change the state of a single bit of a million-bit instance in constant time:

> flipBit 方法创建了一个新的 BigInteger 实例，也有 100 万比特长，只在一个比特上与原始的不同。该操作需要与 BigInteger 的大小成比例的时间和空间。与 `java.util.BitSet` 形成对比。与 BigInteger 一样，BitSet 表示任意长的位序列，但与 BigInteger 不同，BitSet 是可变的。BitSet 类提供了一种方法，可以让你在固定的时间内改变百万比特实例的单个位的状态：

```java
BitSet moby = ...;
moby.flip(0);
```

The performance problem is magnified if you perform a multistep operation that generates a new object at every step, eventually discarding all objects except the final result. There are two approaches to coping with this problem. The first is to guess which multistep operations will be commonly required and to provide them as primitives. If a multistep operation is provided as a primitive, the immutable class does not have to create a separate object at each step. Internally,the immutable class can be arbitrarily clever. For example, BigInteger has a package-private mutable “companion class” that it uses to speed up multistep operations such as modular exponentiation. It is much harder to use the mutable companion class than to use BigInteger, for all of the reasons outlined earlier. Luckily, you don’t have to use it: the implementors of BigInteger did the hard work for you.

> 如果执行多步操作，在每一步生成一个新对象，最终丢弃除最终结果之外的所有对象，那么性能问题就会增大。有两种方法可以解决这个问题。第一种方法是猜测通常需要哪些多步操作，并将它们作为原语提供。如果将多步操作作为基元提供，则不可变类不必在每个步骤中创建单独的对象。在内部，不可变类可以任意聪明。例如，BigInteger 有一个包私有的可变「伴随类」，它使用这个类来加速多步操作，比如模块化求幂。由于前面列出的所有原因，使用可变伴随类要比使用 BigInteger 难得多。幸运的是，你不必使用它：BigInteger 的实现者为你做了艰苦的工作。

The package-private mutable companion class approach works fine if you can accurately predict which complex operations clients will want to perform on your immutable class. If not, then your best bet is to provide a public mutable companion class. The main example of this approach in the Java platform libraries is the String class, whose mutable companion is StringBuilder (and its obsolete predecessor, StringBuffer).

> 如果你能够准确地预测客户端希望在不可变类上执行哪些复杂操作，那么包私有可变伴随类方法就可以很好地工作。如果不是，那么你最好的选择就是提供一个公共可变伴随类。这种方法在 Java 库中的主要示例是 String 类，它的可变伴随类是 StringBuilder（及其过时的前身 StringBuffer)。

Now that you know how to make an immutable class and you understand the pros and cons of immutability, let’s discuss a few design alternatives. Recall that to guarantee immutability, a class must not permit itself to be subclassed. This can be done by making the class final, but there is another, more flexible alternative. Instead of making an immutable class final, you can make all of its constructors private or package-private and add public static factories in place of the public constructors (Item 1). To make this concrete, here’s how Complex would look if you took this approach:

> 既然你已经知道了如何创建不可变类，并且了解了不可变性的优缺点，那么让我们来讨论一些设计方案。回想一下，为了保证不变性，类不允许自己被子类化。这可以通过期末考试来完成，但是还有另外一个更灵活的选择。与使不可变类成为 final 不同，你可以将其所有构造函数变为私有或包-私有，并在公共构造函数的位置添加公共静态工厂（Item-1）。

```java
// Immutable class with static factories instead of constructors
public class Complex {
    private final double re;
    private final double im;
    private Complex(double re, double im) {
        this.re = re;
        this.im = im;
    }
    public static Complex valueOf(double re, double im) {
        return new Complex(re, im);
    }
    ... // Remainder unchanged
}
```

This approach is often the best alternative. It is the most flexible because it allows the use of multiple package-private implementation classes. To its clients that reside outside its package, the immutable class is effectively final because it is impossible to extend a class that comes from another package and that lacks a public or protected constructor. Besides allowing the flexibility of multiple implementation classes, this approach makes it possible to tune the performance of the class in subsequent releases by improving the object-caching capabilities of the static factories.

> 这种方法通常是最好的选择。它是最灵活的，因为它允许使用多个包私有实现类。对于驻留在包之外的客户端，不可变类实际上是最终类，因为不可能扩展来自另一个包的类，因为它缺少公共或受保护的构造函数。除了允许多实现类的灵活性之外，这种方法还通过改进静态工厂的对象缓存功能，使在后续版本中调优该类的性能成为可能。

It was not widely understood that immutable classes had to be effectively final when BigInteger and BigDecimal were written, so all of their methods may be overridden. Unfortunately, this could not be corrected after the fact while preserving backward compatibility. If you write a class whose security depends on the immutability of a BigInteger or BigDecimal argument from an untrusted client, you must check to see that the argument is a “real” BigInteger or BigDecimal, rather than an instance of an untrusted subclass. If it is the latter, you must defensively copy it under the assumption that it might be mutable (Item 50):

> 当编写 BigInteger 和 BigDecimal 时，不可变类必须是有效的 final，因此可以重写它们的所有方法，这一点没有得到广泛的理解。遗憾的是，在保留向后兼容性的情况下，这一问题无法在事后得到纠正。如果你编写的类的安全性依赖于来自不受信任客户端的 BigInteger 或 BigDecimal 参数的不可变性，那么你必须检查该参数是否是「真正的」BigInteger 或 BigDecimal，而不是不受信任子类的实例。如果是后者，你必须防御地复制它，假设它可能是可变的（Item-50）:

```java
public static BigInteger safeInstance(BigInteger val) {
return val.getClass() == BigInteger.class ?
val : new BigInteger(val.toByteArray());
}
```

The list of rules for immutable classes at the beginning of this item says that no methods may modify the object and that all its fields must be final. In fact these rules are a bit stronger than necessary and can be relaxed to improve performance. In truth, no method may produce an externally visible change in the object’s state. However, some immutable classes have one or more nonfinal fields in which they cache the results of expensive computations the first time they are needed. If the same value is requested again, the cached value is returned, saving the cost of recalculation. This trick works precisely because the object is immutable, which guarantees that the computation would yield the same result if it were repeated.

> 这个项目开头的不可变类的规则列表说，没有方法可以修改对象，它的所有字段必须是 final 的。实际上，这些规则比必要的要强大一些，可以通过放松来提高性能。实际上，任何方法都不能在对象的状态中产生外部可见的更改。然而，一些不可变类有一个或多个非最终字段，它们在第一次需要这些字段时，就会在其中缓存昂贵计算的结果。如果再次请求相同的值，则返回缓存的值，从而节省了重新计算的成本。这个技巧之所以有效，是因为对象是不可变的，这保证了如果重复计算，计算将产生相同的结果。

For example, PhoneNumber’s hashCode method (Item 11, page 53) computes the hash code the first time it’s invoked and caches it in case it’s invoked again. This technique, an example of lazy initialization (Item 83), is also used by String.

> 例如，PhoneNumber 的 hashCode 方法(Item-11，第 53 页）在第一次调用时计算哈希代码，并缓存它，以防再次调用它。这个技术是一个延迟初始化的例子（Item-83），String 也使用这个技术。

One caveat should be added concerning serializability. If you choose to have your immutable class implement Serializable and it contains one or more fields that refer to mutable objects, you must provide an explicit readObject or readResolve method, or use the ObjectOutputStream.writeUnshared and ObjectInputStream.readUnshared methods, even if the default serialized form is acceptable. Otherwise an attacker could create a mutable instance of your class. This topic is covered in detail in Item 88.

> 关于可序列化性，应该添加一个注意事项。如果你选择让不可变类实现 Serializable，并且它包含一个或多个引用可变对象的字段，那么你必须提供一个显式的 readObject 或 readResolve 方法，或者使用 ObjectOutputStream。writeUnshared ObjectInputStream。readUnshared 方法，即使默认的序列化形式是可以接受的。否则攻击者可能创建类的可变实例。Item-88 详细讨论了这个主题。

To summarize, resist the urge to write a setter for every getter. **Classes should be immutable unless there’s a very good reason to make them mutable.** Immutable classes provide many advantages, and their only disadvantage is the potential for performance problems under certain circumstances. You should always make small value objects, such as PhoneNumber and Complex, immutable. (There are several classes in the Java platform libraries, such as java.util.Date and java.awt.Point, that should have been immutable but aren’t.) You should seriously consider making larger value objects, such as String and BigInteger, immutable as well. You should provide a public mutable companion class for your immutable class only once you’ve confirmed that it’s necessary to achieve satisfactory performance (Item 67).

> 总结一下，抵制为每个 getter 编写 setter 的冲动。类应该是不可变的，除非有很好的理由让它们可变。不可变类提供了许多优点，它们唯一的缺点是在某些情况下可能出现性能问题。你应该始终创建小的值对象，例如 PhoneNumber 和 Complex、stable。（Java 库中有几个类，比如 `java.util.Date` 和 `java.awt.Point`，这本来是不可改变的，但事实并非如此。）你应该认真考虑将较大的值对象（如 String 和 BigInteger）设置为不可变的。只有在确认了实现满意性能的必要性之后，才应该为不可变类提供一个公共可变伴随类（Item-67）。

There are some classes for which immutability is impractical. **If a class cannot be made immutable, limit its mutability as much as possible.** Reducing the number of states in which an object can exist makes it easier to reason about the object and reduces the likelihood of errors. Therefore, make every field final unless there is a compelling reason to make it nonfinal. Combining the advice of this item with that of Item 15, your natural inclination should be to **declare every field private final unless there’s a good reason to do otherwise.**

> 有些类的不变性是不切实际的。**如果一个类不能成为不可变的，那么就尽可能地限制它的可变性。** 减少对象可能存在的状态数可以使对对象进行推理更容易，并减少出错的可能性。因此，除非有令人信服的理由使每个字段成为 final。将此项目的建议与项目 15 的建议结合起来，你的自然倾向应该是 **声明每个字段为私有 final，除非有很好的理由这样做。**

**Constructors should create fully initialized objects with all of their invariants established.** Don’t provide a public initialization method separate from the constructor or static factory unless there is a compelling reason to do so. Similarly, don’t provide a “reinitialize” method that enables an object to be reused as if it had been constructed with a different initial state. Such methods generally provide little if any performance benefit at the expense of increased complexity.

> **构造函数应该创建完全初始化的对象，并建立所有的不变量。** 不要提供与构造函数或静态工厂分离的公共初始化方法，除非有充分的理由这样做。类似地，不要提供「重新初始化」的方法，该方法允许重用对象，就好像它是用不同的初始状态构造的一样。这些方法通常只提供很少的性能收益，而代价是增加了复杂性。

The CountDownLatch class exemplifies these principles. It is mutable, but its state space is kept intentionally small. You create an instance, use it once, and it’s done: once the countdown latch’s count has reached zero, you may not reuse it.

> CountDownLatch 类演示了这些原理。它是可变的，但它的状态空间故意保持小。你创建一个实例，使用一次，就完成了：一旦倒计时锁的计数达到零，你可能不会重用它。

A final note should be added concerning the Complex class in this item. This example was meant only to illustrate immutability. It is not an industrial-strength complex number implementation. It uses the standard formulas for complex multiplication and division, which are not correctly rounded and provide poor semantics for complex NaNs and infinities [Kahan91, Smith62, Thomas94].

> 关于这个项目中的复杂类，应该添加最后一个注意事项。这个例子只是为了说明不变性。它不是一个工业强度的复数实现。它使用了复杂乘法和除法的标准公式，这些公式没有被正确地四舍五入，并且为复杂的 NaNs 和 infinities 提供了糟糕的语义 [Kahan91, Smith62, Thomas94]。

---

## 【18】优先选择复合而不是继承

> Favor composition over inheritance

Inheritance is a powerful way to achieve（vt. 取得；获得；实现；成功） code reuse（n. 重新使用，再用）, but it is not always the best tool for the job. Used inappropriately（adv. 不适当地）, it leads to fragile（adj. 脆的；易碎的） software. It is safe to use inheritance within a package, where the subclass and the superclass implementations are under the control of the same programmers. It is also safe to use inheritance when extending classes specifically designed and documented for extension (Item 19). Inheriting from ordinary concrete classes across package boundaries, however, is dangerous. As a reminder, this book uses the word “inheritance” to mean implementation inheritance (when one class extends another). The problems discussed in this item do not apply to interface inheritance (when a class implements an interface or when one interface extends another).

> 继承是实现代码重用的一种强大方法，但它并不总是最佳的工具。使用不当会导致软件脆弱。在包中使用继承是安全的，其中子类和超类实现由相同的程序员控制。在扩展专门为扩展设计和文档化的类时使用继承也是安全的（Item-19）。然而，对普通的具体类进行跨包边界的继承是危险的。作为提醒，本书使用「继承」一词来表示实现继承（当一个类扩展另一个类时）。本项目中讨论的问题不适用于接口继承（当类实现接口或一个接口扩展另一个接口时）。

Unlike method invocation, inheritance violates encapsulation [Snyder86].In other words, a subclass depends on the implementation details of its superclass for its proper function. The superclass’s implementation may change from release to release, and if it does, the subclass may break, even though its code has not been touched. As a consequence, a subclass must evolve in tandem with its superclass, unless the superclass’s authors have designed and documented it specifically for the purpose of being extended.

> 与方法调用不同，继承违反了封装[Snyder86]。换句话说，子类的正确功能依赖于它的父类的实现细节。超类的实现可能在版本之间发生变化，如果发生了变化，子类可能会崩溃，即使它的代码没有被修改过。因此，子类必须与其父类同步发展，除非父类是专门为扩展的目的而设计的，并具有很好的文档说明。

To make this concrete, let’s suppose we have a program that uses a HashSet. To tune the performance of our program, we need to query the HashSet as to how many elements have been added since it was created (not to be confused with its current size, which goes down when an element is removed). To provide this functionality, we write a HashSet variant that keeps count of the number of attempted element insertions and exports an accessor for this count. The HashSet class contains two methods capable of adding elements, add and addAll, so we override both of these methods:

> 为了使其更具体一些，让我们假设有一个使用 HashSet 的程序。为了优化程序的性能，我们需要查询 HashSet，以确定自创建以来添加了多少元素（不要与当前的大小混淆，当元素被删除时，当前的大小会递减）。为了提供这个功能，我们编写了一个 HashSet 变量，它记录试图插入的元素数量，并为这个计数导出一个访问。HashSet 类包含两个能够添加元素的方法，add 和 addAll，因此我们覆盖这两个方法：

```java
// Broken - Inappropriate use of inheritance!
public class InstrumentedHashSet<E> extends HashSet<E> {
    // The number of attempted element insertions
    private int addCount = 0;
    public InstrumentedHashSet() {
    }
    public InstrumentedHashSet(int initCap, float loadFactor) {
        super(initCap, loadFactor);
    }
    @Override
    public boolean add(E e) {
        addCount++;
        return super.add(e);
    }
    @Override
    public boolean addAll(Collection<? extends E> c) {
        addCount += c.size();
        return super.addAll(c);
    }
    public int getAddCount() {
        return addCount;
    }
}
```

This class looks reasonable, but it doesn’t work. Suppose we create an instance and add three elements using the addAll method. Incidentally（adv. 顺便；偶然地；附带地）, note that we create a list using the static factory method List.of, which was added in Java 9; if you’re using an earlier release, use Arrays.asList instead:

> 这个类看起来很合理，但是它不起作用。假设我们创建了一个实例，并使用 addAll 方法添加了三个元素。顺便说一下，我们使用 Java 9 中添加的静态工厂方法 List.of 创建了一个列表；如果你使用的是早期版本，那么使用 Arrays.asList:

```java
InstrumentedHashSet<String> s = new InstrumentedHashSet<>();
s.addAll(List.of("Snap", "Crackle", "Pop"));
```

We would expect the getAddCount method to return three at this point, but it returns six. What went wrong? Internally, HashSet’s addAll method is implemented on top of its add method, although HashSet, quite reasonably,does not document this implementation detail. The addAll method in Instrumented-HashSet added three to addCount and then invoked HashSet’s addAll implementation using super.addAll. This in turn invoked the add method, as overridden in InstrumentedHashSet, once for each element. Each of these three invocations added one more to addCount,for a total increase of six: each element added with the addAll method is double-counted.

> 我们希望 getAddCount 方法此时返回 3，但它返回 6。到底是哪里出了错？在内部，HashSet 的 addAll 方法是在其 add 方法之上实现的，尽管 HashSet 相当合理地没有记录这个实现细节。InstrumentedHashSet 中的 addAll 方法向 addCount 添加了三个元素，然后使用 `super.addAll` 调用 HashSet 的 addAll 实现。这反过来调用 add 方法（在 InstrumentedHashSet 中被重写过），每个元素一次。这三个调用中的每一个都向 addCount 添加了一个元素，总共增加了 6 个元素：使用 addAll 方法添加的每个元素都被重复计数。

We could “fix” the subclass by eliminating its override of the addAll method. While the resulting class would work, it would depend for its proper function on the fact that HashSet’s addAll method is implemented on top of its add method. This “self-use” is an implementation detail, not guaranteed to hold in all implementations of the Java platform and subject to change from release to release. Therefore, the resulting InstrumentedHashSet class would be fragile.

> 我们可以通过消除 addAll 方法的覆盖来「修复」子类。虽然生成的类可以工作，但它的正确功能取决于 HashSet 的 addAll 方法是在 add 方法之上实现的事实。这种「自用」是实现细节，不能保证在 Java 平台的所有实现中都存在，也不能保证在版本之间进行更改。因此，结果得到的 InstrumentedHashSet 类是脆弱的。

It would be slightly better to override the addAll method to iterate over the specified collection, calling the add method once for each element. This would guarantee the correct result whether or not HashSet’s addAll method were implemented atop its add method because HashSet’s addAll implementation would no longer be invoked. This technique, however, does not solve all our problems. It amounts to reimplementing superclass methods that may or may not result in self-use, which is difficult, time-consuming, errorprone,and may reduce performance. Additionally, it isn’t always possible because some methods cannot be implemented without access to private fields inaccessible to the subclass.

> 重写 addAll 方法以遍历指定的集合稍微好一些，为每个元素调用一次 add 方法。无论 HashSet 的 addAll 方法是否在其 add 方法之上实现，这都将保证正确的结果，因为 HashSet 的 addAll 实现将不再被调用。然而，这种技术并不能解决我们所有的问题。它相当于重新实现超类方法，这可能会导致自使用，也可能不会，这是困难的、耗时的、容易出错的，并且可能会降低性能。此外，这并不总是可能的，因为如果不访问子类无法访问的私有字段，就无法实现某些方法。

A related cause of fragility in subclasses is that their superclass can acquire new methods in subsequent releases. Suppose a program depends for its security on the fact that all elements inserted into some collection satisfy some predicate.This can be guaranteed by subclassing the collection and overriding each method capable of adding an element to ensure that the predicate is satisfied before adding the element. This works fine until a new method capable of inserting an element is added to the superclass in a subsequent release. Once this happens, it becomes possible to add an “illegal” element merely by invoking the new method, which is not overridden in the subclass. This is not a purely theoretical problem. Several security holes of this nature had to be fixed when Hashtable and Vector were retrofitted to participate in the Collections Framework.

> 子类脆弱的一个相关原因是他们的超类可以在后续版本中获得新的方法。假设一个程序的安全性取决于插入到某个集合中的所有元素满足某个谓词。这可以通过子类化集合和覆盖每个能够添加元素的方法来确保在添加元素之前满足谓词。这可以很好地工作，直到在后续版本中向超类中添加能够插入元素的新方法。一旦发生这种情况，只需调用新方法就可以添加「非法」元素，而新方法在子类中不会被覆盖。这不是一个纯粹的理论问题。当 Hashtable 和 Vector 被重新安装以加入集合框架时，必须修复这一性质的几个安全漏洞。

Both of these problems stem from overriding methods. You might think that it is safe to extend a class if you merely add new methods and refrain from overriding existing methods. While this sort of extension is much safer, it is not without risk. If the superclass acquires a new method in a subsequent release and you have the bad luck to have given the subclass a method with the same signature and a different return type, your subclass will no longer compile [JLS, 8.4.8.3]. If you’ve given the subclass a method with the same signature and return type as the new superclass method, then you’re now overriding it, so you’re subject to the problems described earlier. Furthermore, it is doubtful that your method will fulfill the contract of the new superclass method, because that contract had not yet been written when you wrote the subclass method.

> 这两个问题都源于重写方法。你可能认为，如果只添加新方法，并且不覆盖现有方法，那么扩展类是安全的。虽然这种延长会更安全，但也不是没有风险。如果超类在随后的版本中获得了一个新方法，而你不幸给了子类一个具有相同签名和不同返回类型的方法，那么你的子类将不再编译 [JLS, 8.4.8.3]。如果给子类一个方法，该方法具有与新超类方法相同的签名和返回类型，那么现在要覆盖它，因此你要面对前面描述的问题。此外，你的方法是否能够完成新的超类方法的契约是值得怀疑的，因为在你编写子类方法时，该契约还没有被写入。

Luckily, there is a way to avoid all of the problems described above. Instead of extending an existing class, give your new class a private field that references an instance of the existing class. This design is called composition because the existing class becomes a component of the new one. Each instance method in the new class invokes the corresponding method on the contained instance of the existing class and returns the results. This is known as forwarding, and the methods in the new class are known as forwarding methods. The resulting class will be rock solid, with no dependencies on the implementation details of the existing class. Even adding new methods to the existing class will have no impact on the new class. To make this concrete, here’s a replacement for InstrumentedHashSet that uses the composition-and-forwarding approach. Note that the implementation is broken into two pieces, the class itself and a reusable forwarding class, which contains all of the forwarding methods and nothing else:

> 幸运的是，有一种方法可以避免上述所有问题。与其扩展现有类，不如为新类提供一个引用现有类实例的私有字段。这种设计称为复合，因为现有的类成为新类的一个组件。新类中的每个实例方法调用现有类的包含实例上的对应方法，并返回结果。这称为转发，新类中的方法称为转发方法。生成的类将非常坚固，不依赖于现有类的实现细节。即使向现有类添加新方法，也不会对新类产生影响。为了使其具体化，这里有一个使用复合和转发方法的 InstrumentedHashSet 的替代方法。注意，实现被分成两部分，类本身和一个可重用的转发类，其中包含所有的转发方法，没有其他内容：

```java
// Wrapper class - uses composition in place of inheritance
public class InstrumentedSet<E> extends ForwardingSet<E> {
    private int addCount = 0;
    public InstrumentedSet(Set<E> s) {
        super(s);
    }

    @Override
    public boolean add(E e) {
        addCount++;
        return super.add(e);
    }

    @Override
    public boolean addAll(Collection<? extends E> c) {
        addCount += c.size();
        return super.addAll(c);
    }

    public int getAddCount() {
        return addCount;
    }
  }

// Reusable forwarding class
public class ForwardingSet<E> implements Set<E> {
    private final Set<E> s;
    public ForwardingSet(Set<E> s) { this.s = s; }
    public void clear() { s.clear(); }
    public boolean contains(Object o) { return s.contains(o); }
    public boolean isEmpty() { return s.isEmpty(); }
    public int size() { return s.size(); }
    public Iterator<E> iterator() { return s.iterator(); }
    public boolean add(E e) { return s.add(e); }
    public boolean remove(Object o) { return s.remove(o); }
    public boolean containsAll(Collection<?> c)
    { return s.containsAll(c); }
    public boolean addAll(Collection<? extends E> c)
    { return s.addAll(c); }
    public boolean removeAll(Collection<?> c)
    { return s.removeAll(c); }
    public boolean retainAll(Collection<?> c)
    { return s.retainAll(c); }
    public Object[] toArray() { return s.toArray(); }
    public <T> T[] toArray(T[] a) { return s.toArray(a); }

    @Override
    public boolean equals(Object o){ return s.equals(o); }

    @Override
    public int hashCode() { return s.hashCode(); }

    @Override
    public String toString() { return s.toString(); }
}
```

The design of the InstrumentedSet class is enabled by the existence of the Set interface, which captures the functionality of the HashSet class.Besides being robust, this design is extremely flexible. The InstrumentedSet class implements the Set interface and has a single constructor whose argument is also of type Set. In essence, the class transforms one Set into another, adding the instrumentation functionality. Unlike the inheritance-based approach, which works only for a single concrete class and requires a separate constructor for each supported constructor in the superclass,the wrapper class can be used to instrument any Set implementation and will work in conjunction with any preexisting constructor:

> InstrumentedSet 类的设计是通过 Set 接口来实现的，这个接口可以捕获 HashSet 类的功能。除了健壮外，这个设计非常灵活。InstrumentedSet 类实现了 Set 接口，有一个构造函数，它的参数也是 Set 类型的。实际上，这个类可以将一个 Set 转换成另一个 Set，添加了 instrumentation 的功能。基于继承的方法只适用于单个具体类，并且需要为超类中每个受支持的构造函数提供单独的构造函数，与此不同的是，包装器类可用于仪器任何集合实现，并将与任何现有构造函数一起工作：

```java
Set<Instant> times = new InstrumentedSet<>(new TreeSet<>(cmp));
Set<E> s = new InstrumentedSet<>(new HashSet<>(INIT_CAPACITY));
```

The InstrumentedSet class can even be used to temporarily instrument a set instance that has already been used without instrumentation:

> InstrumentedSet 类甚至还可以用来临时配置一个不用插装就可以使用的 set 实例：

```java
static void walk(Set<Dog> dogs) {
InstrumentedSet<Dog> iDogs = new InstrumentedSet<>(dogs);
... // Within this method use iDogs instead of dogs
}
```

The InstrumentedSet class is known as a wrapper class because each InstrumentedSet instance contains (“wraps”) another Set instance. This is also known as the Decorator pattern [Gamma95] because the InstrumentedSet class “decorates” a set by adding instrumentation.Sometimes the combination of composition and forwarding is loosely referred to as delegation. Technically it’s not delegation unless the wrapper object passes itself to the wrapped object [Lieberman86; Gamma95].

> InstrumentedSet 类被称为包装类，因为每个 entedset 实例都包含(「包装」)另一个集合实例。这也称为 Decorator 模式[Gamma95]，因为 InstrumentedSet 类通过添加插装来「修饰」一个集合。有时组合和转发的组合被松散地称为委托。严格来说，除非包装器对象将自身传递给包装对象，否则它不是委托[Lieberman86; Gamma95]。

The disadvantages of wrapper classes are few. One caveat is that wrapper classes are not suited for use in callback frameworks, wherein objects pass selfreferences to other objects for subsequent invocations (“callbacks”). Because a wrapped object doesn’t know of its wrapper, it passes a reference to itself (this) and callbacks elude the wrapper. This is known as the SELF problem [Lieberman86]. Some people worry about the performance impact of forwarding method invocations or the memory footprint impact of wrapper objects. Neither turn out to have much impact in practice. It’s tedious to write forwarding methods, but you have to write the reusable forwarding class for each interface only once, and forwarding classes may be provided for you. For example, Guava provides forwarding classes for all of the collection interfaces [Guava].

> 包装类的缺点很少。一个警告是包装类不适合在回调框架中使用，在回调框架中，对象为后续调用(「回调」)将自定义传递给其他对象。因为包装对象不知道它的包装器，所以它传递一个对它自己的引用（this），回调避开包装器。这就是所谓的自我问题。有些人担心转发方法调用的性能影响或包装器对象的内存占用影响。这两种方法在实践中都没有多大影响。编写转发方法很麻烦，但是你必须只为每个接口编写一次可重用的转发类，而且可能会为你提供转发类。例如，Guava 为所有的集合接口提供了转发类[Guava]。

Inheritance is appropriate only in circumstances where the subclass really is a subtype of the superclass. In other words, a class B should extend a class A only if an “is-a” relationship exists between the two classes. If you are tempted to have a class B extend a class A, ask yourself the question: Is every B really an A?If you cannot truthfully answer yes to this question, B should not extend A. If the answer is no, it is often the case that B should contain a private instance of A and expose a different API: A is not an essential part of B, merely a detail of its implementation.

> 只有在子类确实是超类的子类型的情况下，继承才合适。换句话说，只有当两个类之间存在「is-a」关系时，类 B 才应该扩展类 a。如果你想让 B 类扩展 a 类，那就问问自己：每个 B 都是 a 吗？如果你不能如实回答是的这个问题，B 不应该延长 a，如果答案是否定的，通常情况下，B 应该包含一个私人的实例，让不同的 API：不是 B 的一个重要组成部分，只是一个细节的实现。

There are a number of obvious violations of this principle in the Java platform libraries. For example, a stack is not a vector, so Stack should not extend Vector. Similarly, a property list is not a hash table, so Properties should not extend Hashtable. In both cases, composition would have been preferable.

> 在 Java 库中有许多明显违反这一原则的地方。例如，堆栈不是向量，因此堆栈不应该扩展向量。类似地，属性列表不是 hash 表，因此属性不应该扩展 hash 表。在这两种情况下，复合都是可取的。

If you use inheritance where composition is appropriate, you needlessly expose implementation details. The resulting API ties you to the original implementation, forever limiting the performance of your class. More seriously,by exposing the internals you let clients access them directly. At the very least, it can lead to confusing semantics. For example, if p refers to a Properties instance, then p.getProperty(key) may yield different results from p.get(key): the former method takes defaults into account, while the latter method, which is inherited from Hashtable, does not. Most seriously, the client may be able to corrupt invariants of the subclass by modifying the superclass directly. In the case of Properties, the designers intended that only strings be allowed as keys and values, but direct access to the underlying Hashtable allows this invariant to be violated. Once violated, it is no longer possible to use other parts of the Properties API (load and store). By the time this problem was discovered, it was too late to correct it because clients depended on the use of non-string keys and values.

> 如果在复合合适的地方使用继承，就不必要地公开实现细节。生成的 API 将你与原始实现绑定在一起，永远限制了类的性能。更严重的是，通过公开内部组件，你可以让客户端直接访问它们。至少，它会导致语义混乱。例如，如果 p 引用了一个属性实例，那么 `p.getProperty(key)` 可能会产生与 `p.get(key)` 不同的结果：前者考虑了默认值，而后者（从 Hashtable 继承而来）则不会。最严重的是，客户端可以通过直接修改超类来破坏子类的不变量。对于属性，设计者希望只允许字符串作为键和值，但是直接访问底层 hash 表允许违反这个不变量。一旦违反，就不再可能使用 Properties API 的其他部分（加载和存储）。当发现这个问题时，已经太晚了，无法纠正它，因为客户端依赖于非字符串键和值的使用。

There is one last set of questions you should ask yourself before deciding to use inheritance in place of composition. Does the class that you contemplate extending have any flaws in its API? If so, are you comfortable propagating those flaws into your class’s API? Inheritance propagates any flaws in the superclass’s API, while composition lets you design a new API that hides these flaws.

> 在决定使用继承而不是复合之前，你应该问自己最后一组问题。你打算扩展的类在其 API 中有任何缺陷吗？如果是这样，你是否愿意将这些缺陷传播到类的 API 中？继承传播超类 API 中的任何缺陷，而复合允许你设计一个新的 API 来隐藏这些缺陷。

To summarize, inheritance is powerful, but it is problematic because it violates encapsulation. It is appropriate only when a genuine subtype relationship exists between the subclass and the superclass. Even then, inheritance may lead to fragility if the subclass is in a different package from the superclass and the superclass is not designed for inheritance. To avoid this fragility, use composition and forwarding instead of inheritance, especially if an appropriate interface to implement a wrapper class exists. Not only are wrapper classes more robust than subclasses, they are also more powerful.

> 总而言之，继承是强大的，但是它是有问题的，因为它违反了封装。只有当子类和超类之间存在真正的子类型关系时才合适。即使这样，如果子类与超类不在一个不同的包中，并且超类不是为继承而设计的，继承也可能导致脆弱性。为了避免这种脆弱性，使用组合和转发而不是继承，特别是如果存在实现包装器类的适当接口的话。包装类不仅比子类更健壮，而且更强大。

---

## 【19】继承要设计良好并且具有文档，否则禁止使用

> Design and document for inheritance or else prohibit it

Item 18 alerted you to the dangers of subclassing a “foreign” class that was not designed and documented for inheritance. So what does it mean for a class to be designed and documented for inheritance?

> Item-18 提醒你注意子类化不是为继承设计和文档化的「外部」类的危险。那么，为继承而设计和文档化的类意味着什么呢？

First, the class must document precisely the effects of overriding any method. In other words, **the class must document its self-use of overridable methods.** For each public or protected method, the documentation must indicate which overridable methods the method invokes, in what sequence, and how the results of each invocation affect subsequent processing. (By overridable, we mean nonfinal and either public or protected.) More generally, a class must document any circumstances under which it might invoke an overridable method. For example, invocations might come from background threads or static initializers.

> 首先，类必须精确地在文档中记录覆盖任何方法的效果。换句话说，类必须在文档中记录它对可覆盖方法的自用。对于每个公共或受保护的方法，文档必须指出方法调用的可覆盖方法、调用顺序以及每次调用的结果如何影响后续处理过程。（可覆盖的意思是非 final 的，公共的或受保护的。)更一般地说，类必须记录它可能调用可覆盖方法的任何情况。例如，调用可能来自后台线程或静态初始化器。

A method that invokes overridable methods contains a description of these invocations at the end of its documentation comment. The description is in a special section of the specification, labeled “Implementation Requirements,”which is generated by the Javadoc tag @implSpec. This section describes the inner workings of the method. Here’s an example, copied from the specification for java.util.AbstractCollection:

> 调用可覆盖方法的方法在其文档注释末尾应包含这些调用的描述。描述在规范的一个特殊部分中，标记为「实现需求」，它由 Javadoc 标签 `@implSpec` 生成。本节描述该方法的内部工作方式。下面是一个示例，复制自 `java.util.AbstractCollection` 规范：

public boolean remove(Object o)

Removes a single instance of the specified（v. 指定；详细说明，adj. 规定的；） element from this collection, if it is present (optional operation). More formally, removes an element e such that Objects.equals(o, e), if this collection contains one or more such elements. Returns true if this collection contained the specified element (or equivalently, if this collection changed as a result of the call).

> 从此集合中移除指定元素的单个实例，如果存在（可选操作）。更正式地说，如果此集合包含一个或多个这样的元素，则删除元素 e，使得 `Objects.equals(o, e)`，如果此 collection 包含指定的元素，则返回 true（或等效地，如果此集合因调用而更改）。

Implementation Requirements: This implementation iterates over the collection looking for the specified element. If it finds the element, it removes the element from the collection using the iterator’s remove method. Note that this implementation throws an UnsupportedOperationException if the iterator returned by this collection’s iterator method does not implement the remove method and this collection contains the specified object.

> 实现需求：这个实现遍历集合，寻找指定的元素。如果找到元素，则使用迭代器的 remove 方法从集合中删除元素。注意，如果这个集合的迭代器方法返回的迭代器没有实现 remove 方法，并且这个集合包含指定的对象，那么这个实现将抛出 UnsupportedOperationException。

This documentation leaves no doubt that overriding the iterator method will affect the behavior of the remove method. It also describes exactly how the behavior of the Iterator returned by the iterator method will affect the behavior of the remove method. Contrast this to the situation in Item 18, where the programmer subclassing HashSet simply could not say whether overriding the add method would affect the behavior of the addAll method.

> 这篇文档无疑说明了重写迭代器方法将影响 remove 方法的行为。它还准确地描述了迭代器方法返回的迭代器的行为将如何影响 remove 方法的行为。与 Item-18 中的情况相反，在 Item-18 中，程序员子类化 HashSet 不能简单地说覆盖 add 方法是否会影响 addAll 方法的行为。

But doesn’t this violate the dictum that good API documentation should describe what a given method does and not how it does it? Yes, it does! This is an unfortunate consequence of the fact that inheritance violates encapsulation. To document a class so that it can be safely subclassed, you must describe implementation details that should otherwise be left unspecified.

> 但是，这是否违背了一个格言：好的 API 文档应该描述一个给定的方法做什么，而不是如何做？是的，它确实（违背了）！这是继承违反封装这一事实的不幸结果。要为一个类编制文档，使其能够安全地子类化，你必须描述实现细节，否则这些细节应该是未指定的。

The @implSpec tag was added in Java 8 and used heavily in Java 9. This tag should be enabled by default, but as of Java 9, the Javadoc utility still ignores it unless you pass the command line switch -tag "apiNote: a :API Note:".

> `@implSpec` 标记在 Java 8 中添加，在 Java 9 中大量使用。默认情况下应该启用这个标记，但是在 Java 9 中，Javadoc 实用程序仍然忽略它，除非传递命令行开关 `-tag "apiNote: a :API Note:"`。

Designing for inheritance involves more than just documenting patterns of self-use. To allow programmers to write efficient subclasses without undue pain, a class may have to provide hooks into its internal workings in the form of judiciously chosen protected methods or, in rare instances, protected fields. For example, consider the removeRange method from java.util.AbstractList:

> 为继承而设计不仅仅是记录自使用的模式。为了允许程序员编写高效的子类而不受不必要的痛苦，类可能必须以明智地选择受保护的方法或（在很少的情况下）受保护的字段的形式为其内部工作提供挂钩。例如，考虑来自 `java.util.AbstractList` 的 removeRange 方法：

protected void removeRange(int fromIndex, int toIndex)

Removes from this list all of the elements whose index is between fromIndex, inclusive, and toIndex, exclusive. Shifts any succeeding elements to the left (reduces their index). This call shortens the list by (toIndex - fromIndex) elements. (If toIndex == fromIndex,this operation has no effect.)

> 从这个列表中删除所有索引位于 fromIndex（包含索引）和 toIndex（独占索引）之间的元素。将任何后续元素移到左边（减少其索引）。这个调用使用 `(toIndex - fromIndex)` 元素缩短列表。（如果 toIndex == fromIndex，此操作无效。）

This method is called by the clear operation on this list and its sublists.Overriding this method to take advantage of the internals of the list implementation can substantially improve the performance of the clear operation on this list and its sublists.

> 此方法由此列表及其子列表上的 clear 操作调用。重写此方法以利用列表实现的内部特性，可以显著提高对该列表及其子列表的 clear 操作的性能。

Implementation Requirements: This implementation gets a list iterator positioned before fromIndex and repeatedly calls ListIterator.next followed by ListIterator.remove, until the entire range has been removed. Note: If ListIterator.remove requires linear time, this implementation requires quadratic time.

> 实现需求：该实现获取位于 fromIndex 之前的列表迭代器，并依次重复调用 `ListIterator.next` 和 `ListIterator.remove`，直到删除整个范围的内容。注意：如果 `ListIterator.remove` 需要线性时间，这个实现需要平方级的时间。

Parameters:

> 参数

fromIndex index of first element to be removed.

> 要删除的第一个元素的 fromIndex 索引。

toIndex index after last element to be removed.

> 要删除的最后一个元素后的索引。

This method is of no interest to end users of a List implementation. It is provided solely to make it easy for subclasses to provide a fast clear method on sublists. In the absence of the removeRange method, subclasses would have to make do with quadratic performance when the clear method was invoked on sublists or rewrite the entire subList mechanism from scratch— not an easy task!

> 此方法对列表实现的最终用户没有任何兴趣。它的提供只是为了让子类更容易在子列表上提供快速清晰的方法。在没有 removeRange 方法的情况下，当在子列表上调用 clear 方法或从头重写整个子列表机制时，子类将不得不处理二次性能——这不是一项简单的任务!

So how do you decide what protected members to expose when you design a class for inheritance? Unfortunately, there is no magic bullet. The best you can do is to think hard, take your best guess, and then test it by writing subclasses.You should expose as few protected members as possible because each one represents a commitment to an implementation detail. On the other hand, you must not expose too few because a missing protected member can render a class practically unusable for inheritance.

> 那么，在为继承设计类时，如何决定要公开哪些受保护的成员呢？不幸的是，没有灵丹妙药。你能做的最好的事情就是认真思考，做出最好的猜测，然后通过编写子类来测试它。你应该尽可能少地公开受保护的成员，因为每个成员都表示对实现细节的承诺。另一方面，你不能公开太多，因为缺少受保护的成员会导致类实际上无法用于继承。

**The only way to test a class designed for inheritance is to write subclasses.** If you omit a crucial protected member, trying to write a subclass will make the omission painfully obvious. Conversely, if several subclasses are written and none uses a protected member, you should probably make it private. Experience shows that three subclasses are usually sufficient to test an extendable class. One or more of these subclasses should be written by someone other than the superclass author.

> **测试为继承而设计的类的唯一方法是编写子类。** 如果你忽略了一个关键的受保护成员，那么尝试编写子类将使遗漏变得非常明显。相反，如果编写了几个子类，而没有一个子类使用受保护的成员，则应该将其设置为私有。经验表明，三个子类通常足以测试一个可扩展类。这些子类中的一个或多个应该由超类作者以外的其他人编写。

When you design for inheritance a class that is likely to achieve wide use, realize that you are committing forever to the self-use patterns that you document and to the implementation decisions implicit in its protected methods and fields. These commitments can make it difficult or impossible to improve the performance or functionality of the class in a subsequent release. Therefore,**you must test your class by writing subclasses before you release it.**

> 当你为继承设计一个可能获得广泛使用的类时，请意识到你将永远致力于你所记录的自使用模式，以及在其受保护的方法和字段中隐含的实现决策。这些承诺会使在后续版本中改进类的性能或功能变得困难或不可能。因此，**你必须在释放类之前通过编写子类来测试类。**

Also, note that the special documentation required for inheritance clutters up normal documentation, which is designed for programmers who create instances of your class and invoke methods on them. As of this writing, there is little in the way of tools to separate ordinary API documentation from information of interest only to programmers implementing subclasses.

> 另外，请注意，继承所需的特殊文档会使普通文档变得混乱，这种文档是为那些创建类实例并在其上调用方法的程序员设计的。在撰写本文时，很少有工具能够将普通 API 文档与只对实现子类的程序员感兴趣的信息分离开来。

There are a few more restrictions that a class must obey to allow inheritance.**Constructors must not invoke overridable methods,** directly or indirectly. If you violate this rule, program failure will result. The superclass constructor runs before the subclass constructor, so the overriding method in the subclass will get invoked before the subclass constructor has run. If the overriding method depends on any initialization performed by the subclass constructor, the method will not behave as expected. To make this concrete, here’s a class that violates this rule:

> 为了允许继承，类必须遵守更多的限制。**构造函数不能直接或间接调用可重写的方法。** 如果你违反了这个规则，程序就会失败。超类构造函数在子类构造函数之前运行，因此在子类构造函数运行之前将调用子类中的覆盖方法。如果重写方法依赖于子类构造函数执行的任何初始化，则该方法的行为将不像预期的那样。为了使其具体化，下面是一个违反此规则的类：

```java
public class Super {
    // Broken - constructor invokes an overridable method
    public Super() {
        overrideMe();
    }
    public void overrideMe() {
    }
}
```

Here’s a subclass that overrides the overrideMe method, which is erroneously invoked by Super’s sole constructor:

> 下面是覆盖 overrideMe 方法的子类，Super 的唯一构造函数错误地调用了 overrideMe 方法：

```java
public final class Sub extends Super {
    // Blank final, set by constructor
    private final Instant instant;
    Sub() {
        instant = Instant.now();
    }
    // Overriding method invoked by superclass constructor
    @Override
    public void overrideMe() {
        System.out.println(instant);
    }
    public static void main(String[] args) {
        Sub sub = new Sub();
        sub.overrideMe();
    }
}
```

You might expect this program to print out the instant twice, but it prints out null the first time because overrideMe is invoked by the Super constructor before the Sub constructor has a chance to initialize the instant field. Note that this program observes a final field in two different states! Note also that if overrideMe had invoked any method on instant, it would have thrown a NullPointerException when the Super constructor invoked overrideMe. The only reason this program doesn’t throw a NullPointerException as it stands is that the println method tolerates null parameters.

> 你可能希望这个程序打印两次 instant，但是它第一次打印 null，因为在子构造函数有机会初始化 instant 字段之前，超级构造函数调用了 overrideMe。注意，这个程序观察了两个不同状态的最后一个字段!还要注意，如果 overrideMe 立即调用了任何方法，那么当超级构造函数调用 overrideMe 时，它会抛出一个 NullPointerException。这个程序不抛出 NullPointerException 的唯一原因是 println 方法允许空参数。

Note that it is safe to invoke private methods, final methods, and static methods, none of which are overridable, from a constructor.

> 注意，从构造函数调用私有方法、最终方法和静态方法是安全的，它们都是不可覆盖的。

The Cloneable and Serializable interfaces present special difficulties when designing for inheritance. It is generally not a good idea for a class designed for inheritance to implement either of these interfaces because they place a substantial burden on programmers who extend the class. There are,however, special actions that you can take to allow subclasses to implement these interfaces without mandating that they do so. These actions are described in Item 13 and Item 86.

> 可克隆和可序列化的接口在设计继承时存在特殊的困难。对于为继承而设计的类来说，实现这两种接口都不是一个好主意，因为它们给扩展类的程序员带来了沉重的负担。但是，你可以采取一些特殊的操作来允许子类实现这些接口，而无需强制它们这样做。Item-13 和 Item-86 叙述了这些行动。

If you do decide to implement either Cloneable or Serializable in a class that is designed for inheritance, you should be aware that because the clone and readObject methods behave a lot like constructors, a similar restriction applies: neither clone nor readObject may invoke an overridable method, directly or indirectly. In the case of readObject, the overriding method will run before the subclass’s state has been deserialized. In the case of clone, the overriding method will run before the subclass’s clone method has a chance to fix the clone’s state. In either case, a program failure is likely to follow. In the case of clone, the failure can damage the original object as well as the clone. This can happen, for example, if the overriding method assumes it is modifying the clone’s copy of the object’s deep structure, but the copy hasn’t been made yet.

> 如果你确实决定在为继承而设计的类中实现 Cloneable 或 Serializable，那么你应该知道，由于克隆和 readObject 方法的行为与构造函数非常相似，因此存在类似的限制：克隆和 readObject 都不能直接或间接调用可覆盖的方法。对于 readObject，重写方法将在子类的状态反序列化之前运行。在克隆的情况下，重写方法将在子类的克隆方法有机会修复克隆的状态之前运行。在任何一种情况下，程序失败都可能随之而来。在克隆的情况下，失败可以破坏原始对象和克隆。例如，如果覆盖方法假设它正在修改对象的深层结构的克隆副本，但是复制还没有完成，那么就会发生这种情况。

Finally, if you decide to implement Serializable in a class designed for inheritance and the class has a readResolve or writeReplace method,you must make the readResolve or writeReplace method protected rather than private. If these methods are private, they will be silently ignored by subclasses. This is one more case where an implementation detail becomes part of a class’s API to permit inheritance.

> 最后，如果你决定在一个为继承而设计的类中实现 Serializable，并且这个类有一个 readResolve 或 writeReplace 方法，那么你必须使 readResolve 或 writeReplace 方法为 protected，而不是 private。如果这些方法是 private 的，它们将被子类静静地忽略。这是实现细节成为类 API 允许继承的一部分的又一种情况。

By now it should be apparent that designing a class for inheritance requires great effort and places substantial limitations on the class. This is not a decision to be undertaken lightly. There are some situations where it is clearly the right thing to do, such as abstract classes, including skeletal implementations of interfaces (Item 20). There are other situations where it is clearly the wrong thing to do, such as immutable classes (Item 17).

> 到目前为止，显然为继承而设计一个类需要付出很大的努力，并且对类有很大的限制。这不是一个可以轻易作出的决定。在某些情况下，这样做显然是正确的，例如抽象类，包括接口的骨架实现（Item-20）。还有一些情况显然是错误的，比如不可变类（Item-17）。

But what about ordinary concrete classes? Traditionally, they are neither final nor designed and documented for subclassing, but this state of affairs is dangerous. Each time a change is made in such a class, there is a chance that subclasses extending the class will break. This is not just a theoretical problem. It is not uncommon to receive subclassing-related bug reports after modifying the internals of a nonfinal concrete class that was not designed and documented for inheritance.

> 但是普通的具体类呢？传统上，它们既不是最终的，也不是为子类化而设计和记录的，但这种状态是危险的。每当在这样的类中进行更改时，扩展类的子类就有可能中断。这不仅仅是一个理论问题。在修改未为继承而设计和记录的非最终具体类的内部结构后，接收与子类相关的 bug 报告并不罕见。

The best solution to this problem is to prohibit subclassing in classes that are not designed and documented to be safely subclassed. There are two ways to prohibit subclassing. The easier of the two is to declare the class final. The alternative is to make all the constructors private or package-private and to add public static factories in place of the constructors. This alternative, which provides the flexibility to use subclasses internally, is discussed in Item 17. Either approach is acceptable.

> 这个问题的最佳解决方案是禁止在没有设计和文档记录的类中进行子类化。有两种方法可以禁止子类化。两者中比较容易的是声明类 final。另一种方法是将所有构造函数变为私有或包私有，并在构造函数的位置添加公共静态工厂。这个替代方案提供了内部使用子类的灵活性，在 Item-17 中进行了讨论。两种方法都可以接受。

This advice may be somewhat controversial because many programmers have grown accustomed to subclassing ordinary concrete classes to add facilities such as instrumentation, notification, and synchronization or to limit functionality. If a class implements some interface that captures its essence, such as Set, List, or Map, then you should feel no compunction about prohibiting subclassing. The wrapper class pattern, described in Item 18, provides a superior alternative to inheritance for augmenting the functionality.

> 这个建议可能有点争议，因为许多程序员已经习惯了子类化普通的具体类，以添加工具、通知和同步等功能或限制功能。如果一个类实现了某个接口，该接口捕获了它的本质，例如 Set、List 或 Map，那么你不应该对禁止子类化感到内疚。在 Item-18 中描述的包装器类模式提供了一种优于继承的方法来增强功能。

If a concrete class does not implement a standard interface, then you may inconvenience some programmers by prohibiting inheritance. If you feel that you must allow inheritance from such a class, one reasonable approach is to ensure that the class never invokes any of its overridable methods and to document this fact. In other words, eliminate the class’s self-use of overridable
methods entirely. In doing so, you’ll create a class that is reasonably safe to subclass. Overriding a method will never affect the behavior of any other method.

> 如果一个具体的类没有实现一个标准的接口，那么你可能会因为禁止继承而给一些程序员带来不便。如果你认为必须允许继承此类类，那么一种合理的方法是确保该类永远不会调用其任何可重写的方法，并记录这一事实。换句话说，消除类的自用 overridable

You can eliminate a class’s self-use of overridable methods mechanically, without changing its behavior. Move the body of each overridable method to a private “helper method” and have each overridable method invoke its private helper method. Then replace each self-use of an overridable method with a direct invocation of the overridable method’s private helper method.

> 你可以在不改变类行为的情况下，机械地消除类对可重写方法的自使用。将每个可覆盖方法的主体移动到一个私有的「助手方法」，并让每个可覆盖方法调用它的私有助手方法。然后，用可覆盖方法的私有助手方法的直接调用替换可覆盖方法的每个自使用。

In summary, designing a class for inheritance is hard work. You must document all of its self-use patterns, and once you’ve documented them, you must commit to them for the life of the class. If you fail to do this, subclasses may become dependent on implementation details of the superclass and may break if the implementation of the superclass changes. To allow others to write efficient subclasses, you may also have to export one or more protected methods.Unless you know there is a real need for subclasses, you are probably better off prohibiting inheritance by declaring your class final or ensuring that there are no accessible constructors.

> 总之，为继承设计一个类是一项艰苦的工作。你必须记录所有的自用模式，并且一旦你记录了它们，你就必须在整个类的生命周期中都遵守它们。如果没有这样做，子类可能会依赖于超类的实现细节，如果超类的实现发生变化，子类可能会崩溃。为了允许其他人编写高效的子类，你可能还需要导出一个或多个受保护的方法。除非你知道确实需要子类，否则最好通过声明类为 final 或确保没有可访问的构造函数的方式来禁止继承。

---

## 【20】接口优于抽象类

> Prefer interfaces to abstract classes

Java has two mechanisms to define a type that permits multiple implementations: interfaces and abstract classes. Since the introduction of default methods for interfaces in Java 8 [JLS 9.4.3], both mechanisms allow you to provide implementations for some instance methods. A major difference is that to implement the type defined by an abstract class, a class must be a subclass of the abstract class. Because Java permits only single inheritance, this restriction on abstract classes severely constrains their use as type definitions.Any class that defines all the required methods and obeys the general contract is permitted to implement an interface, regardless of where the class resides in the class hierarchy.

> Java 有两种机制来定义允许多种实现的类型：接口和抽象类。由于 Java 8 [JLS 9.4.3]中引入了接口的默认方法，这两种机制都允许你为一些实例方法提供实现。一个主要区别是，一个类要实现抽象类定义的类型，该类必须是抽象类的子类。因为 Java 只允许单一继承，所以这种对抽象类的限制严重制约了它们作为类型定义的使用。任何定义了所有必需的方法并遵守通用约定的类都允许实现接口，而不管该类驻留在类层次结构中何处。

**译注：第一段可拆分出有关抽象类和接口的描述**

**1、抽象类的局限：一个类要实现抽象类定义的类型，该类必须是抽象类的子类。因为 Java 只允许单一继承，所以这种对抽象类的限制严重制约了它们作为类型定义的使用。**

**2、接口的优点：任何定义了所有必需的方法并遵守通用约定的类都允许实现接口，而不管该类驻留在类层次结构中何处。**

**Existing classes can easily be retrofitted to implement a new interface.** All you have to do is to add the required methods, if they don’t yet exist, and to add an implements clause to the class declaration. For example, many existing classes were retrofitted to implement the Comparable, Iterable, and Autocloseable interfaces when they were added to the platform. Existing classes cannot, in general, be retrofitted to extend a new abstract class. If you want to have two classes extend the same abstract class, you have to place it high up in the type hierarchy where it is an ancestor of both classes. Unfortunately,this can cause great collateral damage to the type hierarchy, forcing all descendants of the new abstract class to subclass it, whether or not it is appropriate.

> **可以很容易地对现有类进行改造，以实现新的接口。** 你所要做的就是添加所需的方法（如果它们还不存在的话），并向类声明中添加一个 implements 子句。例如，许多现有的类在添加到平台时进行了修改，以实现 Comparable、Iterable 和 Autocloseable 接口。一般来说，现有的类不能被修改以扩展新的抽象类。如果你想让两个类扩展同一个抽象类，你必须把它放在类型层次结构的高层，作为两个类的祖先。不幸的是，这可能会对类型层次结构造成巨大的附带损害，迫使新抽象类的所有后代对其进行子类化，无论它是否合适。

**Interfaces are ideal for defining mixins.** Loosely speaking, a mixin is a type that a class can implement in addition to its “primary type,” to declare that it provides some optional behavior. For example, Comparable is a mixin interface that allows a class to declare that its instances are ordered with respect to other mutually comparable objects. Such an interface is called a mixin because it allows the optional functionality to be “mixed in” to the type’s primary functionality. Abstract classes can’t be used to define mixins for the same reason that they can’t be retrofitted onto existing classes: a class cannot have more than one parent, and there is no reasonable place in the class hierarchy to insert a mixin.

> **接口是定义 mixin（混合类型）的理想工具。** 粗略地说，mixin 是类除了「基本类型」之外还可以实现的类型，用于声明它提供了一些可选的行为。例如，Comparable 是一个 mixin 接口，它允许类表明它的实例可以与其他的可相互比较的对象进行排序。这样的接口称为 mixin，因为它允许可选功能「混合」到类型的主要功能中。抽象类不能用于定义 mixin，原因与它们不能被修改到现有类相同：一个类不能有多个父类，而且在类层次结构中没有插入 mixin 的合理位置。

**Interfaces allow for the construction of nonhierarchical type frameworks.** Type hierarchies are great for organizing some things, but other things don’t fall neatly into a rigid hierarchy. For example, suppose we have an interface representing a singer and another representing a songwriter:

> **接口允许构造非层次化类型框架。** 类型层次结构对于组织一些事情很好，但是其他事情不能整齐地归入严格的层次结构。例如，假设我们有一个代表歌手的接口和另一个代表词曲作者的接口：

```java
public interface Singer {
    AudioClip sing(Song s);
}

public interface Songwriter {
    Song compose(int chartPosition);
}
```

In real life, some singers are also songwriters. Because we used interfaces rather than abstract classes to define these types, it is perfectly permissible for a single class to implement both Singer and Songwriter. In fact, we can define a third interface that extends both Singer and Songwriter and adds new methods that are appropriate to the combination:

> 在现实生活中，一些歌手也是词曲作者。因为我们使用接口而不是抽象类来定义这些类型，所以完全允许单个类同时实现歌手和词曲作者。事实上，我们可以定义第三个接口，扩展歌手和词曲作者，并添加适合这种组合的新方法：

```java
public interface SingerSongwriter extends Singer, Songwriter {
    AudioClip strum();
    void actSensitive();
}
```

You don’t always need this level of flexibility, but when you do, interfaces are a lifesaver. The alternative is a bloated class hierarchy containing a separate class for every supported combination of attributes. If there are n attributes in the type system, there are 2n possible combinations that you might have to support. This is what’s known as a combinatorial explosion. Bloated class hierarchies can lead to bloated classes with many methods that differ only in the type of their arguments because there are no types in the class hierarchy to capture common behaviors.

> 你并不总是需要这种级别的灵活性，但是当你需要时，接口就是救星。另一种选择是一个臃肿的类层次结构，它为每个受支持的属性组合包含一个单独的类。如果类型系统中有 n 个属性，那么可能需要支持 2<sup>n</sup>种组合。这就是所谓的组合爆炸。臃肿的类层次结构可能导致类也臃肿，其中许多方法只在其参数的类型上有所不同，因为类层次结构中没有类型来捕获常见行为。

Interfaces enable safe, powerful functionality（n. 功能；[数] 泛函性，函数性） enhancements via the wrapper class idiom (Item 18). If you use abstract classes to define types, you leave the programmer who wants to add functionality with no alternative but inheritance. The resulting classes are less powerful and more fragile than wrapper classes.

> 通过 Item-18 介绍的包装类，接口能够支持安全、强大的功能增强。如果你使用抽象类来定义类型，那么你将让希望添加功能的程序员除了继承之外别无选择。最终生成的类不如包装类强大，也更脆弱。

When there is an obvious implementation of an interface method in terms of other interface methods, consider providing implementation assistance to programmers in the form of a default method. For an example of this technique, see the removeIf method on page 104. If you provide default methods, be sure to document them for inheritance using the @implSpec Javadoc tag (Item 19).

> 当接口方法的其他接口方法有明显的实现时，考虑以默认方法的形式为程序员提供实现帮助。有关此技术的示例，请参阅第 104 页的 removeIf 方法。如果你提供了默认方法，请使用 `@implSpec` 标签，并确保在文档中记录他们的继承关系（Item-19）。

There are limits on how much implementation assistance（n. 援助，帮助；辅助设备） you can provide with default methods. Although many interfaces specify the behavior of Object methods such as equals and hashCode, you are not permitted to provide default methods for them. Also, interfaces are not permitted to contain instance fields or nonpublic static members (with the exception of private static methods). Finally, you can’t add default methods to an interface that you don’t control.

> 默认方法可以为实现提供的帮助有限。尽管许多接口指定了诸如 equals 和 hashCode 等对象方法的行为，但是不允许为它们提供默认方法。此外，接口不允许包含实例字段或非公共静态成员（私有静态方法除外）。最后，你不能向你不控制的接口添加默认方法。

You can, however, combine the advantages of interfaces and abstract classes by providing an abstract skeletal implementation class to go with an interface. The interface defines the type, perhaps providing some default methods, while the skeletal implementation class implements the remaining non-primitive interface methods atop the primitive interface methods. Extending a skeletal implementation takes most of the work out of implementing an interface. This is the Template Method pattern [Gamma95].

> 但是，你可以通过提供一个抽象骨架实现类来结合接口和抽象类的优点。接口定义了类型，可能提供了一些默认方法，而骨架实现类在基本接口方法之上实现了其余的非基本接口方法。扩展骨架实现需要完成实现接口的大部分工作。这是模板方法模式 [Gamma95]。

By convention, skeletal implementation classes are called AbstractInterface, where Interface is the name of the interface they implement. For example, the Collections Framework provides a skeletal implementation to go along with each main collection interface: AbstractCollection, AbstractSet, AbstractList, and AbstractMap. Arguably it would have made sense to call them SkeletalCollection, SkeletalSet, SkeletalList, and SkeletalMap, but the Abstract convention is now firmly established. When properly designed, skeletal implementations (whether a separate abstract class, or consisting solely of default methods on an interface) can make it very easy for programmers to provide their own implementations of an interface. For example, here’s a static factory method containing a complete, fully functional List implementation atop AbstractList:

> 按照惯例，骨架实现类称为 AbstractInterface，其中 Interface 是它们实现的接口的名称。例如，Collections Framework 提供了一个骨架实现来配合每个主要的集合接口：AbstractCollection、AbstractSet、AbstractList 和 AbstractMap。可以说，将它们称为 SkeletalCollection、SkeletalSet、SkeletalList 和 SkeletalMap 是有意义的，但 Abstract 的用法现在已经根深蒂固。如果设计得当，骨架实现（无论是单独的抽象类，还是仅仅由接口上的默认方法组成）可以使程序员非常容易地提供他们自己的接口实现。例如，这里有一个静态工厂方法，它在 AbstractList 上包含一个完整的、功能完整的 List 实现：

```java
// Concrete implementation built atop skeletal implementation
static List<Integer> intArrayAsList(int[] a) {
        Objects.requireNonNull(a);
        // The diamond operator is only legal here in Java 9 and later
        // If you're using an earlier release, specify <Integer>
        return new AbstractList<>() {
            @Override
            public Integer get(int i) {
                return a[i]; // Autoboxing (Item 6)
            }

            @Override
            public Integer set(int i, Integer val) {
                int oldVal = a[i];
                a[i] = val; // Auto-unboxing
                return oldVal; // Autoboxing
            }

            @Override
            public int size() {
                return a.length;
            }
        };
}
```

When you consider all that a List implementation does for you, this example is an impressive demonstration of the power of skeletal implementations. Incidentally, this example is an Adapter [Gamma95] that allows an int array to be viewed as a list of Integer instances. Because of all the translation back and forth between int values and Integer instances (boxing and unboxing), its performance is not terribly good. Note that the implementation takes the form of an anonymous class (Item 24).

> 当你考虑到 List 实现为你做的所有事情时，这个例子是骨架实现强大功能的一个令人印象深刻的演示。顺便说一句，这个示例是一个 Adapter（适配器）[Gamma95]，它允许将 int 数组视为 Integer 实例的 list。因为在 int 值和 Integer 实例（装箱和拆箱）之间来回转换，所以它的性能不是很好。注意，实现的形式是匿名类（Item-24）。

The beauty of skeletal implementation classes is that they provide all of the implementation assistance of abstract classes without imposing the severe constraints that abstract classes impose when they serve as type definitions. For most implementors of an interface with a skeletal implementation class, extending this class is the obvious choice, but it is strictly optional. If a class cannot be made to extend the skeletal implementation, the class can always implement the interface directly. The class still benefits from any default methods present on the interface itself. Furthermore, the skeletal implementation can still aid the implementor’s task. The class implementing the interface can forward invocations of interface methods to a contained instance of a private inner class that extends the skeletal implementation. This technique, known as simulated multiple inheritance, is closely related to the wrapper class idiom discussed in Item 18. It provides many of the benefits of multiple inheritance, while avoiding the pitfalls.

> 骨架实现类的美妙之处在于，它们提供了抽象类的所有实现帮助，而不像抽象类作为类型定义时那样受到严格的约束。对于具有骨架实现类的接口的大多数实现来说，扩展这个类是显而易见的选择，但它并不是必需的。如果不能使类扩展骨架实现，则类总是可以直接实现接口。类仍然受益于接口本身的任何默认方法。此外，骨架实现仍然可以帮助实现人员完成任务。实现接口的类可以将接口方法的调用转发给扩展骨架实现的私有内部类的包含实例。这种技术称为模拟多重继承，与 Item-18 中讨论的包装类密切相关。它提供了多重继承的许多好处，同时避免了缺陷。

Writing a skeletal implementation is a relatively simple, if somewhat tedious, process. First, study the interface and decide which methods are the primitives in terms of which the others can be implemented. These primitives will be the abstract methods in your skeletal implementation. Next, provide default methods in the interface for all of the methods that can be implemented directly atop the primitives, but recall that you may not provide default methods for Object methods such as equals and hashCode. If the primitives and default methods cover the interface, you’re done, and have no need for a skeletal implementation class. Otherwise, write a class declared to implement the interface, with implementations of all of the remaining interface methods. The class may contain any nonpublic fields ands methods appropriate to the task.

> 编写一个骨架实现是一个相对简单的过程，尽管有点乏味。首先，研究接口并决定哪些方法是基本方法，以便其他方法可以根据它们实现。这些基本方法将是你的骨架实现中的抽象方法。接下来，在接口中为所有可以直接在原语之上实现的方法提供默认方法，但请记住，你可能不会为诸如 equals 和 hashCode 之类的对象方法提供默认方法。如果原语和默认方法覆盖了接口，那么就完成了，不需要一个骨架实现类。否则，编写一个声明为实现接口的类，并实现所有剩余的接口方法。该类可能包含任何适合于任务的非公共字段和方法。

As a simple example, consider the Map.Entry interface. The obvious primitives are getKey, getValue, and (optionally) setValue. The interface specifies the behavior of equals and hashCode, and there is an obvious implementation of toString in terms of the primitives. Since you are not allowed to provide default implementations for the Object methods, all implementations are placed in the skeletal implementation class:

> 作为一个简单的例子，考虑一下 `Map.Entry` 接口。最明显的基本方法是 getKey、getValue 和（可选的）setValue。该接口指定了 equals 和 hashCode 的行为，并且在基本方法方面有 toString 的明显实现。由于不允许为对象方法提供默认实现，所有实现都放在骨架实现类中：

```java
// Skeletal implementation class
public abstract class AbstractMapEntry<K,V> implements Map.Entry<K,V> {

    // Entries in a modifiable map must override this method
    @Override public V setValue(V value) {
        throw new UnsupportedOperationException();
    }

    // Implements the general contract of Map.Entry.equals
    @Override public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Map.Entry))
            return false;
        Map.Entry<?,?> e = (Map.Entry) o;
        return Objects.equals(e.getKey(), getKey()) && Objects.equals(e.getValue(), getValue());
    }

    // Implements the general contract of Map.Entry.hashCode
    @Override public int hashCode() {
        return Objects.hashCode(getKey())^ Objects.hashCode(getValue());
    }

    @Override public String toString() {
        return getKey() + "=" + getValue();
    }
}
```

Note that this skeletal implementation could not be implemented in the Map.Entry interface or as a subinterface because default methods are not permitted to override Object methods such as equals, hashCode, and toString.

> 注意，这个骨架实现不能在 `Map.Entry` 接口或子接口中实现，因为不允许默认方法覆盖诸如 equals、hashCode 和 toString 等对象方法。

Because skeletal implementations are designed for inheritance, you should follow all of the design and documentation guidelines in Item 19. For brevity’s sake, the documentation comments were omitted from the previous example, but good documentation is absolutely essential in a skeletal implementation, whether it consists of default methods on an interface or a separate abstract class.

> 因为骨架实现是为继承而设计的，所以你应该遵循 Item-19 中的所有设计和文档指南。为了简洁起见，在前面的示例中省略了文档注释，但是优秀的文档对于骨架实现来说是绝对必要的，不管它是由接口上的默认方法还是单独的抽象类组成。

A minor variant on the skeletal implementation is the simple implementation, exemplified by AbstractMap.SimpleEntry. A simple implementation is like a skeletal implementation in that it implements an interface and is designed for inheritance, but it differs in that it isn’t abstract: it is the simplest possible working implementation. You can use it as it stands or subclass it as circumstances warrant.

> 骨架实现的一个小变体是简单实现，例如 `AbstractMap.SimpleEntry`。一个简单的实现就像一个骨架实现，因为它实现了一个接口，并且是为继承而设计的，但是它的不同之处在于它不是抽象的：它是最简单的工作实现。你可以根据它的状态使用它，也可以根据情况对它进行子类化。

To summarize, an interface is generally the best way to define a type that permits multiple implementations. If you export a nontrivial（adj. 非平凡的） interface, you should strongly consider providing a skeletal implementation to go with it. To the extent possible, you should provide the skeletal implementation via default methods on the interface so that all implementors of the interface can make use of it. That said, restrictions on interfaces typically mandate that a skeletal implementation take the form of an abstract class.

> 总之，接口通常是定义允许多种实现的类型的最佳方法。如果导出了一个重要的接口，则应该强烈考虑提供一个骨架实现。尽可能地，你应该通过接口上的默认方法提供骨架实现，以便接口的所有实现者都可以使用它。也就是说，对接口的限制通常要求框架实现采用抽象类的形式。

---

## 【21】为后代设计接口

> Design interfaces for posterity

Prior to Java 8, it was impossible to add methods to interfaces without breaking existing implementations. If you added a new method to an interface, existing implementations would, in general, lack the method, resulting in a compile-time error. In Java 8, the default method construct was added [JLS 9.4], with the intent of allowing the addition of methods to existing interfaces. But adding new methods to existing interfaces is fraught with risk.

> 在 Java 8 之前，在不破坏现有实现的情况下向接口添加方法是不可能的。如果在接口中添加新方法，现有的实现通常会缺少该方法，从而导致编译时错误。在 Java 8 中，添加了默认的方法构造 [JLS 9.4]，目的是允许向现有接口添加方法。但是向现有接口添加新方法充满了风险。

The declaration for a default method includes a default implementation that is used by all classes that implement the interface but do not implement the default method. While the addition of default methods to Java makes it possible to add methods to an existing interface, there is no guarantee that these methods will work in all preexisting implementations. Default methods are “injected” into existing implementations without the knowledge or consent of their implementors. Before Java 8, these implementations were written with the tacit understanding that their interfaces would never acquire any new methods.

> 默认方法的声明包括一个默认实现，所有实现接口但不实现默认方法的类都使用这个默认实现。虽然向 Java 添加默认方法使向现有接口添加方法成为可能，但不能保证这些方法在所有现有实现中都能工作。默认方法被「注入」到现有的实现中，而无需实现者的知情或同意。在 Java 8 之前，编写这些实现时都默认它们的接口永远不会获得任何新方法。

Many new default methods were added to the core collection interfaces in Java 8, primarily to facilitate the use of lambdas (Chapter 6). The Java libraries’ default methods are high-quality general-purpose implementations, and in most cases, they work fine. **But it is not always possible to write a default method that maintains all invariants of every conceivable implementation.**

> Java 8 的核心集合接口增加了许多新的默认方法，主要是为了方便 lambdas 的使用（第 6 章）。**但是，并不总是能够编写一个默认方法来维护每个可想到的实现的所有不变量**

For example, consider the removeIf method, which was added to the Collection interface in Java 8. This method removes all elements for which a given boolean function (or predicate) returns true. The default implementation is specified to traverse the collection using its iterator, invoking the predicate on each element, and using the iterator’s remove method to remove the elements for which the predicate returns true. Presumably the declaration looks something like this:

> 例如，考虑 removeIf 方法，它被添加到 Java 8 中的集合接口中。该方法删除了给定的布尔函数（或 predicate）返回 true 的所有元素。指定默认实现，以使用迭代器遍历集合，在每个元素上调用 predicate，并使用迭代器的 remove 方法删除谓词返回 true 的元素。大概声明是这样的：

```java
// Default method added to the Collection interface in Java 8
default boolean removeif(predicate<? super e> filter) {
    objects.requirenonnull(filter);
    boolean result = false;
    for (iterator<e> it = iterator(); it.hasnext(); ) {
        if (filter.test(it.next())) {
            it.remove();
            result = true;
        }
    }
    return result;
}
```

This is the best general-purpose implementation one could possibly write for the removeIf method, but sadly, it fails on some real-world Collection implementations. For example, consider org.apache.commons.collections4.collection.SynchronizedCollection. This class, from the Apache Commons library, is similar to the one returned by the static factory Collections.-synchronizedCollection in java.util. The Apache version additionally provides the ability to use a client-supplied object for locking, in place of the collection. In other words, it is a wrapper class (Item 18), all of whose methods synchronize on a locking object before delegating to the wrapped collection.

> 这是为 removeIf 方法编写的最好的通用实现，但遗憾的是，它在一些实际的集合实现中失败了。例如，考虑 `org.apache.commons.collections4.collection.SynchronizedCollection`。这个类来自 Apache Commons 库，类似于静态工厂集合返回的类。-synchronizedCollection java.util。Apache 版本还提供了使用客户端提供的对象进行锁定的功能，以代替集合。换句话说，它是一个包装器类（Item-18），其所有方法在委托给包装集合之前同步锁定对象。

The Apache SynchronizedCollection class is still being actively maintained, but as of this writing, it does not override the removeIf method. If this class is used in conjunction with Java 8, it will therefore inherit the default implementation of removeIf, which does not, indeed cannot, maintain the class’s fundamental promise: to automatically synchronize around each method invocation. The default implementation knows nothing about synchronization and has no access to the field that contains the locking object. If a client calls the removeIf method on a SynchronizedCollection instance in the presence of concurrent modification of the collection by another thread, a ConcurrentModificationException or other unspecified behavior may result.

> Apache SynchronizedCollection 类仍然得到了积极的维护，但是在编写本文时，它没有覆盖 removeIf 方法。如果这个类与 Java 8 一起使用，那么它将继承 removeIf 的默认实现，而 removeIf 并不能维护类的基本承诺：自动同步每个方法调用。默认实现对同步一无所知，也无法访问包含锁定对象的字段。如果客户端在 SynchronizedCollection 实例上调用 removeIf 方法，而另一个线程同时修改了集合，那么可能会导致 ConcurrentModificationException 或其他未指定的行为。

In order to prevent this from happening in similar Java platform libraries implementations, such as the package-private class returned by Collections.synchronizedCollection, the JDK maintainers had to override the default removeIf implementation and other methods like it to perform the necessary synchronization before invoking the default implementation. Preexisting collection implementations that were not part of the Java platform did not have the opportunity to make analogous changes in lockstep with the interface change, and some have yet to do so.

> 为了防止类似的 Java 库实现（例如 `Collections.synchronizedCollection` 返回的包私有类）中发生这种情况，JDK 维护人员必须覆盖默认的 removeIf 实现和其他类似的方法，以便在调用默认实现之前执行必要的同步。不属于 Java 平台的现有集合实现没有机会与接口更改同步进行类似的更改，有些实现还没有这样做。

**In the presence of default methods, existing implementations of an interface may compile without error or warning but fail at runtime.** While not terribly common, this problem is not an isolated incident either. A handful of the methods added to the collections interfaces in Java 8 are known to be susceptible, and a handful of existing implementations are known to be affected.

> 在有默认方法的情况下，接口的现有实现可以在没有错误或警告的情况下编译，但是在运行时失败。虽然这个问题并不常见，但也不是孤立的事件。已知 Java 8 中添加到集合接口的少数方法是易受影响的，已知会影响到现有的少数实现。

Using default methods to add new methods to existing interfaces should be avoided unless the need is critical, in which case you should think long and hard about whether an existing interface implementation might be broken by your default method implementation. Default methods are, however, extremely useful for providing standard method implementations when an interface is created, to ease the task of implementing the interface (Item 20).

> 除非必要，否则应该避免使用默认方法向现有接口添加新方法，在这种情况下，你应该仔细考虑现有接口实现是否可能被默认方法破坏。然而，在创建接口时，默认方法对于提供标准方法实现非常有用，以减轻实现接口的任务（Item-20）。

It is also worth noting that default methods were not designed to support removing methods from interfaces or changing the signatures of existing methods. Neither of these interface changes is possible without breaking existing clients.

> 同样值得注意的是，默认方法的设计并不支持从接口中删除方法或更改现有方法的签名。在不破坏现有客户端的情况下，这些更改都是不可能的。

The moral is clear. Even though default methods are now a part of the Java platform, **it is still of the utmost importance to design interfaces with great care.** While default methods make it possible to add methods to existing interfaces, there is great risk in doing so. If an interface contains a minor flaw, it may irritate its users forever; if an interface is severely deficient, it may doom the API that contains it.

> 这个教训很清楚。尽管默认方法现在已经是 Java 平台的一部分，但是谨慎地设计接口仍然是非常重要的。**虽然默认方法使向现有接口添加方法成为可能，但这样做存在很大风险。** 如果一个接口包含一个小缺陷，它可能会永远激怒它的使用者；如果接口有严重缺陷，它可能会毁掉包含它的 API。

Therefore, it is critically important to test each new interface before you release it. Multiple programmers should implement each interface in different ways. At a minimum, you should aim for three diverse implementations. Equally important is to write multiple client programs that use instances of each new interface to perform various tasks. This will go a long way toward ensuring that each interface satisfies all of its intended uses. These steps will allow you to discover flaws in interfaces before they are released, when you can still correct them easily. **While it may be possible to correct some interface flaws after an interface is released, you cannot count on it.**

> 因此，在发布每个新接口之前对其进行测试非常重要。多个程序员应该以不同的方式实现每个接口。至少，你应该以三种不同的实现为目标。同样重要的是编写多个客户端程序，这些程序使用每个新接口的实例来执行各种任务。这将大大有助于确保每个接口满足其所有预期用途。这些步骤将允许你在接口被发布之前发现它们的缺陷，而你仍然可以轻松地纠正它们。**虽然在接口被发布之后可以纠正一些接口缺陷，但是你不能指望这种方式。**

---

## 【22】接口只用于定义类型

> Use interfaces only to define types

When a class implements an interface, the interface serves as a type that can be used to refer to instances of the class. That a class implements an interface should therefore say something about what a client can do with instances of the class. It is inappropriate to define an interface for any other purpose.

> 当一个类实现了一个接口时，这个接口作为一种类型，可以用来引用类的实例。因此，实现接口的类应该说明客户端可以对类的实例做什么。为任何其他目的定义接口都是不合适的。

One kind of interface that fails this test is the so-called constant interface. Such an interface contains no methods; it consists solely of static final fields, each exporting a constant. Classes using these constants implement the interface to avoid the need to qualify constant names with a class name. Here is an example:

> 不满足上述条件的一种接口是所谓的常量接口。这样的接口不包含任何方法；它仅由静态 final 字段组成，每个字段导出一个常量。使用这些常量的类实现接口，以避免用类名限定常量名。下面是一个例子：

```java
// Constant interface antipattern - do not use!
public interface PhysicalConstants {
    // Avogadro's number (1/mol)
    static final double AVOGADROS_NUMBER = 6.022_140_857e23;

    // Boltzmann constant (J/K)
    static final double BOLTZMANN_CONSTANT = 1.380_648_52e-23;

    // Mass of the electron (kg)
    static final double ELECTRON_MASS = 9.109_383_56e-31;
}
```

The constant interface pattern is a poor use of interfaces. That a class uses some constants internally is an implementation detail. Implementing a constant interface causes this implementation detail to leak into the class’s exported API. It is of no consequence to the users of a class that the class implements a constant interface. In fact, it may even confuse them. Worse, it represents a commitment: if in a future release the class is modified so that it no longer needs to use the constants, it still must implement the interface to ensure binary compatibility. If a nonfinal class implements a constant interface, all of its subclasses will have their namespaces polluted by the constants in the interface.

> 常量接口模式是对接口的糟糕使用。类内部使用一些常量是实现细节。实现常量接口会导致这个实现细节泄漏到类的导出 API 中。对于类的用户来说，类实现一个常量接口并没有什么价值。事实上，这甚至会让他们感到困惑。更糟糕的是，它代表了一种承诺：如果在将来的版本中修改了类，使其不再需要使用常量，那么它仍然必须实现接口以确保二进制兼容性。如果一个非 final 类实现了一个常量接口，那么它的所有子类的名称空间都会被接口中的常量所污染。

There are several constant interfaces in the Java platform libraries, such as java.io.ObjectStreamConstants. These interfaces should be regarded as anomalies and should not be emulated.

> Java 库中有几个常量接口，例如 `java.io.ObjectStreamConstants`。这些接口应该被视为反例，不应该被效仿。

If you want to export constants, there are several reasonable choices. If the constants are strongly tied to an existing class or interface, you should add them to the class or interface. For example, all of the boxed numerical primitive classes, such as Integer and Double, export MIN_VALUE and MAX_VALUE constants. If the constants are best viewed as members of an enumerated type, you should export them with an enum type (Item 34). Otherwise, you should export the constants with a noninstantiable utility class (Item 4). Here is a utility class version of the PhysicalConstants example shown earlier:

> 如果你想导出常量，有几个合理的选择。如果这些常量与现有的类或接口紧密绑定，则应该将它们添加到类或接口。例如，所有装箱的数值包装类，比如 Integer 和 Double，都导出 MIN_VALUE 和 MAX_VALUE 常量。如果最好将这些常量看作枚举类型的成员，那么应该使用 enum 类型导出它们（Item-34）。否则，你应该使用不可实例化的工具类（Item-4）导出常量。下面是一个之前的 PhysicalConstants 例子的工具类另一个版本：

```java
// Constant utility class
package com.effectivejava.science;

public class PhysicalConstants {
    private PhysicalConstants() { } // Prevents instantiation（将构造私有，阻止实例化）
    public static final double AVOGADROS_NUMBER = 6.022_140_857e23;
    public static final double BOLTZMANN_CONST = 1.380_648_52e-23;
    public static final double ELECTRON_MASS = 9.109_383_56e-31;
}
```

Incidentally, note the use of the underscore character ( \_ ) in the numeric literals. Underscores, which have been legal since Java 7, have no effect on the values of numeric literals, but can make them much easier to read if used with discretion. Consider adding underscores to numeric literals, whether fixed of floating point, if they contain five or more consecutive digits. For base ten literals, whether integral or floating point, you should use underscores to separate literals into groups of three digits indicating positive and negative powers of one thousand.

> 顺便说一下，请注意在数字字面值中使用了下划线（ \_ ）。下划线自 Java 7 以来一直是合法的，它对数字字面值没有影响，如果谨慎使用，可以使它们更容易阅读。考虑添加下划线到数字字面值，无论是固定的浮点数，如果它们包含五个或多个连续数字。对于以 10 为基数的字面值，无论是整数还是浮点数，都应该使用下划线将字面值分隔为三位数，表示 1000 的正幂和负幂。

Normally a utility class requires clients to qualify constant names with a class name, for example, PhysicalConstants.AVOGADROS_NUMBER. If you make heavy use of the constants exported by a utility class, you can avoid the need for qualifying the constants with the class name by making use of the static import facility:

> 通常，工具类要求客户端使用类名来限定常量名，例如 `PhysicalConstants.AVOGADROS_NUMBER`。如果你大量使用工具类导出的常量，你可以通过使用静态导入机制来避免使用类名限定常量：

```java
// Use of static import to avoid qualifying constants
import static com.effectivejava.science.PhysicalConstants.*;

public class Test {
    double atoms(double mols) {
        return AVOGADROS_NUMBER * mols;
    } ...
    // Many more uses of PhysicalConstants justify static import
}
```

In summary, interfaces should be used only to define types. They should not be used merely to export constants.

> 总之，接口应该只用于定义类型。它们不应该用于导出常量。

---

## 【23】类层次结构优于带标签的类

> Prefer class hierarchies to tagged classes

Occasionally you may run across a class whose instances come in two or more flavors and contain a tag field indicating the flavor of the instance. For example, consider this class, which is capable of representing a circle or a rectangle:

> 有时候，你可能会遇到这样一个类，它的实例有两种或两种以上的样式，并且包含一个标签字段，指示实例的样式。例如，考虑这个类，它能够表示一个圆或一个矩形：

```java
// Tagged class - vastly inferior to a class hierarchy!
class Figure {
    enum Shape {RECTANGLE, CIRCLE};

    // Tag field - the shape of this figure
    final Shape shape;

    // These fields are used only if shape is RECTANGLE
    double length;

    double width;

    // This field is used only if shape is CIRCLE
    double radius;

    // Constructor for circle
    Figure(double radius) {
        shape = Shape.CIRCLE;
        this.radius = radius;
    }

    // Constructor for rectangle
    Figure(double length, double width) {
        shape = Shape.RECTANGLE;
        this.length = length;
        this.width = width;
    }

    double area() {
        switch (shape) {
            case RECTANGLE:
                return length * width;
            case CIRCLE:
                return Math.PI * (radius * radius);
            default:
                throw new AssertionError(shape);
        }
    }
}
```

Such tagged classes have numerous（adj. 许多的，很多的） shortcomings. They are cluttered with boilerplate, including enum declarations, tag fields, and switch statements. Readability is further harmed because multiple implementations are jumbled together in a single class. Memory footprint is increased because instances are burdened with irrelevant fields belonging to other flavors. Fields can’t be made final unless constructors initialize irrelevant fields, resulting in more boilerplate. Constructors must set the tag field and initialize the right data fields with no help from the compiler: if you initialize the wrong fields, the program will fail at runtime. You can’t add a flavor to a tagged class unless you can modify its source file. If you do add a flavor, you must remember to add a case to every switch statement, or the class will fail at runtime. Finally, the data type of an instance gives no clue as to its flavor. In short, **tagged classes are verbose, error-prone, and inefficient.**

> 这样的标签类有许多缺点。它们充斥着样板文件，包括 enum 声明、标签字段和 switch 语句。可读性会进一步受损，因为多个实现在一个类中混杂在一起。内存占用增加了，因为实例被其他类型的不相关字段所累。除非构造函数初始化不相关的字段，导致更多的样板文件，否则字段不能成为 final。构造函数必须设置标签字段并初始化正确的数据字段，而不需要编译器的帮助：如果初始化了错误的字段，程序将在运行时失败。除非你能够修改它的源文件，否则你不能向标签类添加样式。如果你确实添加了一个样式，那么你必须记住为每个 switch 语句添加一个 case，否则类将在运行时失败。最后，实例的数据类型没有给出它任何关于风格的线索。简而言之，**标签类冗长、容易出错和低效。**

Luckily, object-oriented languages such as Java offer a far better alternative for defining a single data type capable of representing objects of multiple flavors: subtyping. **A tagged class is just a pallid（adj. 苍白的；暗淡的；无生气的） imitation of a class hierarchy.**

> 幸运的是，面向对象的语言（如 Java）提供了一个更好的选择来定义能够表示多种类型对象的单一数据类型：子类型。**标签的类只是类层次结构的（简单）的模仿。**

To transform a tagged class into a class hierarchy, first define an abstract class containing an abstract method for each method in the tagged class whose behavior depends on the tag value. In the Figure class, there is only one such method, which is area. This abstract class is the root of the class hierarchy. If there are any methods whose behavior does not depend on the value of the tag, put them in this class. Similarly, if there are any data fields used by all the flavors, put them in this class. There are no such flavor-independent methods or fields in the Figure class.

> 要将已标签的类转换为类层次结构，首先为标签类中的每个方法定义一个包含抽象方法的抽象类，其行为依赖于标签值。在 Figure 类中，只有一个这样的方法，即 area 方法。这个抽象类是类层次结构的根。如果有任何方法的行为不依赖于标签的值，请将它们放在这个类中。类似地，如果有任何数据字段被所有种类使用，将它们放在这个类中。在 Figure 类中没有这样的独立于味道的方法或字段。

Next, define a concrete subclass of the root class for each flavor of the original tagged class. In our example, there are two: circle and rectangle. Include in each subclass the data fields particular to its flavor. In our example, radius is particular to circle, and length and width are particular to rectangle. Also include in each subclass the appropriate implementation of each abstract method in the root class. Here is the class hierarchy corresponding to the original Figure class:

> 接下来，为原始标签类的每个类型定义根类的具体子类。在我们的例子中，有两个：圆形和矩形。在每个子类中包含特定于其风格的数据字段。在我们的例子中，半径是特定于圆的，长度和宽度是特定于矩形的。还应在每个子类中包含根类中每个抽象方法的适当实现。下面是原 Figure 类对应的类层次结构：

```java
// Class hierarchy replacement for a tagged class
abstract class Figure {
    abstract double area();
}

class Circle extends Figure {
    final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * (radius * radius);
    }
}

class Rectangle extends Figure {
    final double length;
    final double width;

    Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }

    @Override
    double area() {
        return length * width;
    }
}
```

This class hierarchy（n. 层级；等级制度） corrects every shortcoming of tagged classes noted previously. The code is simple and clear, containing none of the boilerplate found in the original. The implementation of each flavor is allotted its own class, and none of these classes is encumbered by irrelevant data fields. All fields are final. The compiler ensures that each class’s constructor initializes its data fields and that each class has an implementation for every abstract method declared in the root class. This eliminates the possibility of a runtime failure due to a missing switch case. Multiple programmers can extend the hierarchy independently and interoperably without access to the source for the root class. There is a separate data type associated with each flavor, allowing programmers to indicate the flavor of a variable and to restrict variables and input parameters to a particular flavor.

> 这个类层次结构纠正了前面提到的标签类的所有缺点。代码简单明了，不包含原始代码中的样板文件。每种风格的实现都分配了自己的类，这些类中没有一个被不相关的数据字段拖累。所有字段为 final 字段。编译器确保每个类的构造函数初始化它的数据字段，并且每个类对于根类中声明的每个抽象方法都有一个实现。这消除了由于缺少开关情况而导致运行时失败的可能性。多个程序员可以独立地和互操作地扩展层次结构，而不需要访问根类的源。每种风格都有一个单独的数据类型，允许程序员指示变量的风格，并将变量和输入参数限制为特定的风格。

Another advantage of class hierarchies is that they can be made to reflect natural hierarchical relationships among types, allowing for increased flexibility and better compile-time type checking. Suppose the tagged class in the original example also allowed for squares. The class hierarchy could be made to reflect the fact that a square is a special kind of rectangle (assuming both are immutable):

> 类层次结构的另一个优点是，可以使它们反映类型之间的自然层次关系，从而提高灵活性和更好的编译时类型检查。假设原始示例中的标签类也允许使用正方形。类层次结构可以反映这样一个事实，即正方形是一种特殊的矩形（假设两者都是不可变的）：

```java
class Square extends Rectangle {
  Square(double side) {
    super(side, side);
  }
}
```

Note that the fields in the above hierarchy are accessed directly rather than by accessor methods. This was done for brevity and would be a poor design if the hierarchy were public (Item 16).

> 注意，上面层次结构中的字段是直接访问的，而不是通过访问器方法访问的。这样做是为了简洁，如果层次结构是公共的，那么这将是一个糟糕的设计（Item-16）。

In summary, tagged classes are seldom appropriate. If you’re tempted to write a class with an explicit tag field, think about whether the tag could be eliminated and the class replaced by a hierarchy. When you encounter an existing class with a tag field, consider refactoring it into a hierarchy.

> 总之，标签类很少有合适的时候。如果你想用显式标签字段编写类，请考虑是否可以消除标签并用层次结构替换类。当你遇到带有标签字段的现有类时，请考虑将其重构为层次结构。

---

## 【24】支持使用静态成员类而不是非静态类

> Favor static member classes over nonstatic

A nested class is a class defined within another class. A nested class should exist only to serve its enclosing class. If a nested class would be useful in some other context, then it should be a top-level class. There are four kinds of nested classes: static member classes, nonstatic member classes, anonymous classes, and local classes. All but the first kind are known as inner classes. This item tells you when to use which kind of nested class and why.

> 嵌套类是在另一个类中定义的类。嵌套类应该只为外部类服务。如果嵌套类在其他环境中有用，那么它应该是顶级类。有四种嵌套类：静态成员类、非静态成员类、匿名类和局部类。除了第一种，所有的类都被称为内部类。本条目会告诉你什么时候使用哪种嵌套类以及原因。

A static member class is the simplest kind of nested class. It is best thought of as an ordinary class that happens to be declared inside another class and has access to all of the enclosing class’s members, even those declared private. A static member class is a static member of its enclosing class and obeys the same accessibility rules as other static members. If it is declared private, it is accessible only within the enclosing class, and so forth.

> 静态成员类是最简单的嵌套类。最好把它看做是一个普通的类，只是碰巧在另一个类中声明而已，并且可以访问外部类的所有成员，甚至那些声明为 private 的成员。静态成员类是其外部类的静态成员，并且遵守与其他静态成员相同的可访问性规则。如果声明为私有，则只能在外部类中访问，等等。

One common use of a static member class is as a public helper class, useful only in conjunction（n. 结合；[语] 连接词；同时发生） with its outer class. For example, consider an enum describing the operations supported by a calculator (Item 34). The Operation enum should be a public static member class of the Calculator class. Clients of Calculator could then refer to operations using names like Calculator.Operation.PLUS and Calculator.Operation.MINUS.

> 静态成员类的一个常见用法是作为公有的辅助类，只有与它的外部类一起使用时才有意义。例如，考虑一个描述了计算器支持的各种操作的枚举（Item-34）。Operation 枚举应该是 Calculator 类的公有静态成员类，Calculator 类的客户端就可以用 `Calculator.Operation.PLUS` 和 `Calculator.Operation.MINUS` 等名称来引用这些操作。

Syntactically（adv. 依照句法地；在语句构成上）, the only difference between static and nonstatic member classes is that static member classes have the modifier static in their declarations. Despite（n. 轻视；憎恨；侮辱；prep. 尽管，不管） the syntactic similarity, these two kinds of nested classes are very different. Each instance of a nonstatic member class is implicitly associated with an enclosing instance of its containing class. Within instance methods of a nonstatic member class, you can invoke methods on the enclosing instance or obtain a reference to the enclosing instance using the qualified this construct [JLS, 15.8.4]. If an instance of a nested class can exist in isolation from an instance of its enclosing class, then the nested class must be a static member class: it is impossible to create an instance of a nonstatic member class without an enclosing instance.

> 从语法上讲，静态成员类和非静态成员类之间的唯一区别是静态成员类在其声明中具有修饰符 static。尽管语法相似，但这两种嵌套类有很大不同。非静态成员类的每个实例都隐式地与外部类的外部实例相关联。在非静态成员类的实例方法中，你可以调用外部实例上的方法，或者使用受限制的 this 构造获得对外部实例的引用 [JLS, 15.8.4]。如果嵌套类的实例可以独立于外部类的实例存在，那么嵌套类必须是静态成员类：如果没有外部实例，就不可能创建非静态成员类的实例。

The association between a nonstatic member class instance and its enclosing instance is established when the member class instance is created and cannot be modified thereafter. Normally, the association is established automatically by invoking a nonstatic member class constructor from within an instance method of the enclosing class. It is possible, though rare, to establish the association manually using the expression enclosingInstance.new MemberClass(args). As you would expect, the association takes up space in the nonstatic member class instance and adds time to its construction.

> 非静态成员类实例与外部实例之间的关联是在创建成员类实例时建立的，之后无法修改。通常，关联是通过从外部类的实例方法中调用非静态成员类构造函数自动建立的。使用 `enclosingInstance.new MemberClass(args)` 表达式手动建立关联是可能的，尽管这种情况很少见。正如你所期望的那样，关联占用了非静态成员类实例中的空间，并为其构造增加了时间。

One common use of a nonstatic member class is to define an Adapter [Gamma95] that allows an instance of the outer class to be viewed as an instance of some unrelated class. For example, implementations of the Map interface typically use nonstatic member classes to implement their collection views, which are returned by Map’s keySet, entrySet, and values methods. Similarly, implementations of the collection interfaces, such as Set and List, typically use nonstatic member classes to implement their iterators:

> 非静态成员类的一个常见用法是定义一个适配器 [Gamma95]，它允许外部类的实例被视为某个不相关类的实例。例如，Map 接口的实现通常使用非静态成员类来实现它们的集合视图，这些视图由 Map 的 keySet、entrySet 和 values 方法返回。类似地，集合接口的实现，例如 Set 和 List，通常使用非静态成员类来实现它们的迭代器：

```java
// Typical use of a nonstatic member class
public class MySet<E> extends AbstractSet<E> {
    ... // Bulk of the class omitted
    @Override
    public Iterator<E> iterator() {
        return new MyIterator();
    }
    private class MyIterator implements Iterator<E> {
      ...
    }
}
```

**If you declare a member class that does not require access to an enclosing instance, always put the static modifier in its declaration,** making it a static rather than a nonstatic member class. If you omit this modifier, each instance will have a hidden extraneous reference to its enclosing instance. As previously mentioned, storing this reference takes time and space. More seriously, it can result in the enclosing instance being retained when it would otherwise be eligible for garbage collection (Item 7). The resulting memory leak can be catastrophic. It is often difficult to detect because the reference is invisible.

> **如果声明的成员类不需要访问外部的实例，那么应始终在声明中添加 static 修饰符，使其成为静态的而不是非静态的成员类。** 如果省略这个修饰符，每个实例都有一个隐藏的对其外部实例的额外引用。如前所述，存储此引用需要时间和空间。更严重的是，它可能会在满足进行垃圾收集条件时仍保留外部类的实例（Item-7）。由于引用是不可见的，因此通常很难检测到。

A common use of private static member classes is to represent components of the object represented by their enclosing class. For example, consider a Map instance, which associates keys with values. Many Map implementations have an internal Entry object for each key-value pair in the map. While each entry is associated with a map, the methods on an entry (getKey, getValue, and setValue) do not need access to the map. Therefore, it would be wasteful to use a nonstatic member class to represent entries: a private static member class is best. If you accidentally omit the static modifier in the entry declaration, the map will still work, but each entry will contain a superfluous reference to the map, which wastes space and time.

> 私有静态成员类的一个常见用法是表示由其外部类表示的对象的组件。例如，考虑一个 Map 实例，它将 key 与 value 关联起来。许多 Map 实现的内部对于映射中的每个 key-value 对都有一个 Entry 对象。虽然每个 entry 都与 Map 关联，但 entry 上的方法（getKey、getValue 和 setValue）不需要访问 Map。因此，使用非静态成员类来表示 entry 是浪费：私有静态成员类是最好的。如果你不小心在 entry 声明中省略了静态修饰符，那么映射仍然可以工作，但是每个 entry 都包含对 Map 的多余引用，这会浪费空间和时间。

It is doubly important to choose correctly between a static and a nonstatic member class if the class in question is a public or protected member of an exported class. In this case, the member class is an exported API element and cannot be changed from a nonstatic to a static member class in a subsequent release without violating backward compatibility.

> 如果所讨论的类是导出类的公共成员或受保护成员，那么在静态成员类和非静态成员类之间正确选择就显得尤为重要。在本例中，成员类是导出的 API 元素，在后续版本中，不能在不违反向后兼容性的情况下将非静态成员类更改为静态成员类。

As you would expect, an anonymous class has no name. It is not a member of its enclosing class. Rather than being declared along with other members, it is simultaneously declared and instantiated at the point of use. Anonymous classes are permitted at any point in the code where an expression is legal. Anonymous classes have enclosing instances if and only if they occur in a nonstatic context. But even if they occur in a static context, they cannot have any static members other than constant variables, which are final primitive or string fields initialized to constant expressions [JLS, 4.12.4].

> 如你所料，匿名类没有名称。它不是外部类的成员。它不是与其他成员一起声明的，而是在使用时同时声明和实例化。匿名类在代码中任何一个表达式合法的地方都是被允许的。当且仅当它们发生在非静态环境中时，匿名类才具有外部类实例。但是，即使它们发生在静态环境中，它们也不能有除常量变量以外的任何静态成员，常量变量是最终的基本类型或初始化为常量表达式的字符串字段 [JLS, 4.12.4]。

There are many limitations on the applicability of anonymous classes. You can’t instantiate them except at the point they’re declared. You can’t perform instanceof tests or do anything else that requires you to name the class. You can’t declare an anonymous class to implement multiple interfaces or to extend a class and implement an interface at the same time. Clients of an anonymous class can’t invoke any members except those it inherits from its supertype. Because anonymous classes occur in the midst of expressions, they must be kept short—about ten lines or fewer—or readability will suffer.

> 匿名类的适用性有很多限制。你不能实例化它们，除非在声明它们的时候。你不能执行 instanceof 测试，也不能执行任何其他需要命名类的操作。你不能声明一个匿名类来实现多个接口或扩展一个类并同时实现一个接口。匿名类的客户端除了从超类型继承的成员外，不能调用任何成员。因为匿名类发生在表达式的中间，所以它们必须保持简短——大约 10 行或几行，否则可读性会受到影响。

Before lambdas were added to Java (Chapter 6), anonymous classes were the preferred means of creating small function objects and process objects on the fly, but lambdas are now preferred (Item 42). Another common use of anonymous classes is in the implementation of static factory methods (see intArrayAsList in Item 20).

> 在 lambdas 被添加到 Java（Chapter 6）之前，匿名类是动态创建小函数对象和进程对象的首选方法，但 lambdas 现在是首选方法（Item-42）。匿名类的另一个常见用法是实现静态工厂方法（参见 Item-20 中的 intArrayAsList 类）。

Local classes are the least frequently used of the four kinds of nested classes. A local class can be declared practically anywhere a local variable can be declared and obeys the same scoping rules. Local classes have attributes in common with each of the other kinds of nested classes. Like member classes, they have names and can be used repeatedly. Like anonymous classes, they have enclosing instances only if they are defined in a nonstatic context, and they cannot contain static members. And like anonymous classes, they should be kept short so as not to harm readability.

> 局部类是四种嵌套类中最不常用的。局部类几乎可以在任何能够声明局部变量的地方使用，并且遵守相同的作用域规则。局部类具有与其他嵌套类相同的属性。与成员类一样，它们有名称，可以重复使用。与匿名类一样，它们只有在非静态环境中定义的情况下才具有外部类实例，而且它们不能包含静态成员。和匿名类一样，它们应该保持简短，以免损害可读性。

To recap, there are four different kinds of nested classes, and each has its place. If a nested class needs to be visible outside of a single method or is too long to fit comfortably inside a method, use a member class. If each instance of a member class needs a reference to its enclosing instance, make it nonstatic; otherwise, make it static. Assuming the class belongs inside a method, if you need to create instances from only one location and there is a preexisting type that characterizes the class, make it an anonymous class; otherwise, make it a local class.

> 简单回顾一下，有四种不同类型的嵌套类，每一种都有自己的用途。如果嵌套的类需要在单个方法之外可见，或者太长，不适合放入方法中，则使用成员类。如果成员类的每个实例都需要引用其外部类实例，则使其非静态；否则，让它保持静态。假设嵌套类属于方法内部，如果你只需要从一个位置创建实例，并且存在一个能够描述类的现有类型，那么将其设置为匿名类；否则，将其设置为局部类。

---

## 【25】源文件仅限有单个顶层类

> Limit source files to a single top-level class

While the Java compiler lets you define multiple top-level classes in a single source file, there are no benefits associated with doing so, and there are significant risks. The risks stem from the fact that defining multiple top-level classes in a source file makes it possible to provide multiple definitions for a class. Which definition gets used is affected by the order in which the source files are passed to the compiler. To make this concrete, consider this source file, which contains only a Main class that refers to members of two other top-level classes (Utensil and Dessert):

> 虽然 Java 编译器允许你在单个源文件中定义多个顶层类，但这样做没有任何好处，而且存在重大风险。这种风险源于这样一个事实，即在源文件中定义多个顶层类使得为一个类提供多个定义成为可能。所使用的定义受源文件传给编译器的顺序的影响。要使这个问题具体化，请考虑这个源文件，它只包含一个主类，该主类引用另外两个顶层类的成员（餐具和甜点）：

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Utensil.NAME + Dessert.NAME);
    }
}
```

Now suppose you define both Utensil and Dessert in a single source file named Utensil.java:

> 现在假设你在一个名为 `Utensil.java` 的源文件中定义了餐具和甜点：

```java
// Two classes defined in one file. Don't ever do this!
// 在一个文件中定义两个类。永远不要这样做!
class Utensil {
    static final String NAME = "pan";
}

class Dessert {
    static final String NAME = "cake";
}
```

Of course the main program prints pancake. Now suppose you accidentally make another source file named Dessert.java that defines the same two classes:

> 当然，main 方法应该输出 pancake。现在假设你意外地制作了另一个名为 Dessert 的源文件。java 定义了相同的两个类：

```java
// Two classes defined in one file. Don't ever do this!
// 在一个文件中定义两个类。永远不要这样做!
class Utensil {
    static final String NAME = "pot";
}

class Dessert {
    static final String NAME = "pie";
}
```

If you’re lucky enough to compile the program with the command javac Main.java Dessert.java, the compilation will fail, and the compiler will tell you that you’ve multiply defined the classes Utensil and Dessert. This is so because the compiler will first compile Main.java, and when it sees the reference to Utensil (which precedes the reference to Dessert), it will look in Utensil.java for this class and find both Utensil and Dessert. When the compiler encounters Dessert.java on the command line, it will pull in that file too, causing it to encounter both definitions of Utensil and Dessert.

> 如果你足够幸运，使用 `javac Main.java Dessert.java` 命令编译程序时，编译将失败，编译器将告诉你多重定义了餐具和甜点。这是因为编译器将首先编译 Main.java，当它看到对 Utensil 的引用（在对 Dessert 的引用之前）时，它将在 Utensil.java 中查找这个类，并找到餐具和甜点。当编译器在命令行上遇到 Dessert.java 时，（编译器）也会载入该文件，导致（编译器）同时遇到 Utensil 和 Dessert 的定义。

If you compile the program with the command javac Main.java or javac Main.java Utensil.java, it will behave as it did before you wrote the Dessert.java file, printing pancake. But if you compile the program with the command javac Dessert.java Main.java, it will print potpie. The behavior of the program is thus affected by the order in which the source files are passed to the compiler, which is clearly unacceptable.

> 如果你使用命令 `javac Main.java` 或 `javac Main.java Utensil.java` 编译程序，它的行为将与编写 `Dessert.java` 文件（打印 pancake）之前一样。但是如果你使用命令 `javac Dessert.java Main.java` 编译程序，它将打印 potpie。因此，程序的行为受到源文件传递给编译器的顺序的影响，这显然是不可接受的。

Fixing the problem is as simple as splitting the top-level classes (Utensil and Dessert, in the case of our example) into separate source files. If you are tempted to put multiple top-level classes into a single source file, consider using static member classes (Item 24) as an alternative to splitting the classes into separate source files. If the classes are subservient to another class, making them into static member classes is generally the better alternative because it enhances readability and makes it possible to reduce the accessibility of the classes by declaring them private (Item 15). Here is how our example looks with static member classes:

> 修复这个问题非常简单，只需将顶层类（在我们的示例中是餐具和甜点）分割为单独的源文件即可。如果你想将多个顶层类放到一个源文件中，请考虑使用静态成员类（Item-24）作为将类分割为单独的源文件的替代方法。如果（多个顶层类）隶属于另一个类，那么将它们转换成静态成员类通常是更好的选择，因为它增强了可读性，并通过声明它们为私有（Item-15），从而降低了类的可访问性。下面是我们的静态成员类示例的样子：

```java
// Static member classes instead of multiple top-level classes
public class Test {

    public static void main(String[] args) {
        System.out.println(Utensil.NAME + Dessert.NAME);
    }

    private static class Utensil {
        static final String NAME = "pan";
    }

    private static class Dessert {
        static final String NAME = "cake";
    }
}
```

The lesson is clear: Never put multiple top-level classes or interfaces in a single source file. Following this rule guarantees that you can’t have multiple definitions for a single class at compile time. This in turn guarantees that the class files generated by compilation, and the behavior of the resulting program, are independent of the order in which the source files are passed to the compiler.

> 教训很清楚：永远不要将多个顶层类或接口放在一个源文件中。遵循此规则可以确保在编译时单个类不能拥有多个定义。这反过来保证了编译所生成的类文件，以及程序的行为，是独立于源代码文件传递给编译器的顺序的。
