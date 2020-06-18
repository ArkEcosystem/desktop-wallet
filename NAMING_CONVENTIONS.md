# Naming Conventions

**The objective of this document is to help when naming things and make the codebase consistent and easier to read.**

-   Names should be always be **Descriptive** & **Succinct**.

-   Names should **not** be _Obscure_ or _Abbreviated_. An example would be `NavBar` or `NavigationBar` where `NavigationBar` is more clear and has no downsides.

-   Arguments should always be named in a way that immediately makes their intent clear.

-   Avoid single letter names or abbreviations unless it is something like `x` and `y` when working with geometrical operations.

-   Avoid names like small, medium and large and instead use sm, md and lg from tools like TailwindCSS. These will be familiar to everyone involved and allow you to make use of them in your code to construct other values.

-   Avoid technical terms or additions to names if they do not add value. An example would be `ContactSupportModal` where the `Modal` part adds no value because the important part is that the component is responsible for support contact.
