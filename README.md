# 🚀 DC-Market

A full-featured marketplace web application for trading items with 1:1 chat, real-time interactions, and user-driven content — built with a modern TypeScript/React stack.


WARNING: Add product is currently unavailable as no online storage is set!!!

---

## 🛠️ Tech Stack

**Frameworks & Libraries**
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [zod](https://github.com/colinhacks/zod)

---

## 🌱 Learning Journey

### ⚛️ Next.js
Practiced extensively through multiple projects, including one that displays popular movies using custom APIs. By the end of this project, I've grown comfortable with **App Router**, **Server Actions**, and **Client Components**.

### 🎨 Tailwind CSS
I started with no Tailwind experience — now I deeply understand its **utility-first design**, **responsive modifiers**, and custom theming. My early commits show the transformation from trial to mastery.

> "Concept of Modifiers and Responsive Modifiers blew my mind."

### 🧩 Prisma ORM
Handled complex relational data:
- Products
- Users
- Chatrooms
- Reviews  
Smooth database communication with **type-safe queries** and **schema modeling**.

### 🛡️ Supabase
Real-time backend used for **auth**, **chatroom linkage**, and **user management**.

### 🔐 TypeScript & zod
Used [zod](https://github.com/colinhacks/zod) for schema validation across both front-end forms and server-side logic — enforcing consistent data types and improving safety across the stack.

---

## ✅ Features

### 🔐 Authentication
- Login via GitHub or Email
- Passwords encrypted with **bcrypt**

---

### 📦 Product Management
Add, edit, delete product listings.

```ts
if (session.id) {
  const product = await db.product.create({
    data: {
      title: result.data.title,
      description: result.data.description,
      price: result.data.price,
      photo: result.data.photo,
      user: { connect: { id: session.id } },
    },
    select: { id: true },
  });
  revalidatePath("/home");
  redirect(`/products/${product.id}`);
}
```

### ♾️ Infinite Scrolling
Auto-loads more products as you scroll.
IntersectionObserver + useRef + useEffect

![chrome-capture-2025-7-17](https://github.com/user-attachments/assets/509c5fef-1477-4ed5-bcd6-946b0cd6363a)

```
const trigger = useRef<HTMLSpanElement>(null); // connects span element
    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
                const element = entries[0];
                if (element.isIntersecting && trigger.current) {
                    // if span element can be seen, stop observe and load more products.
                    observer.unobserve(trigger.current);
                    setIsLoading(true);
                    const newProducts = await getMoreProducts(page + 1);
                    if (newProducts.length !== 0) {
                        setPage((prev) => prev + 1);
                        setProducts((prev) => [...prev, ...newProducts]);
                    } else {
                        setIsLastPage(true);
                    }
                    setIsLoading(false);
                }
            },
            {
                threshold: 1.0,
            },
        );
        if (trigger.current) {
            observer.observe(trigger.current);
        }
        return () => {
            // clean up function
            observer.disconnect();
        };
    }, [page]); //observing begins everytime page value is changed, this allows infinite scrolling```
```

### 💬 1:1 Chatroom System
Instantly connects buyer and seller in a dedicated chatroom.

```
const newRoom = await db.chatRoom.create({
        data: {
            product: {
                connect: { id: productId },
            },
            users: {
                connect: [{ id: sellerId }, { id: session.id }],
            },
        },
        select: { id: true },
    });

    redirect(`/chats/${newRoom.id}`);
```

<img width="340" height="755" alt="image" src="https://github.com/user-attachments/assets/e631f9c4-ce75-481d-9285-abc76f15ef5b" />

### ⭐ Review & Rating System
Buyers rate sellers after a completed trade.

1 to 5-star system with optional comments.

```
await db.review.create({
        data: {
            productId,
            reviewerId,
            revieweeId: product.userId,
            rating,
            comment,
        },
    });
```
<img width="340" height="755" alt="image" src="https://github.com/user-attachments/assets/31b46c62-4b37-4973-bb3e-44557306a649" />

### 🧮 Sort & Filter Reviews & Products
Filter by Highest, Lowest, Newest, or Oldest:

```
const handleSort = (option: "highest" | "lowest" | "newest" | "oldest") => {
        setSortOption(option);

        const sorted = [...filteredReviews];

        sorted.sort((a, b) => {
            switch (option) {
                case "highest":
                    return b.rating - a.rating;
                case "lowest":
                    return a.rating - b.rating;
                case "newest":
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case "oldest":
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                default:
                    return 0;
            }
        });

        setFilteredReviews(sorted);
    };
```
<img width="340" height="755" alt="image" src="https://github.com/user-attachments/assets/452d1e0b-4111-47ce-8513-39addce7ae68" />

### 📝 Post Feed
Users can post content, receive likes, and comments.
Includes view count, like system, and comment threads.

<img width="340" height="755" alt="image" src="https://github.com/user-attachments/assets/fd1723cc-9295-477e-bd42-b68b66a7d80f" />


## Challenges
✅ Type Handling with TypeScript
Managing types between server actions and form data, especially with FormData and Zod validation, forced me to think in strict schemas and made my code much more robust.

✅ Client vs Server Components
Navigating Next.js App Router’s server-client separation was confusing at first, especially when I needed client-side sorting but the homepage was server-rendered. I learned to refactor by using a wrapper component and lifting state properly.

✅ Infinite Scroll Logic
Building infinite scrolling with IntersectionObserver and preventing duplicate items taught me how to manage reactivity and edge cases (like stale state and extra API calls).

✅ Conditional Rendering & Revalidation
Revalidating paths selectively (instead of full-page reloads) required architectural thinking. I learned to use revalidateTag, revalidatePath, and useActionState effectively.

✅ Deploying to Vercel
I faced hardships deploying to vercel as the building process caused a lot of trouble. I had to fix code and push to github so many times to solve it.

## What I learned
More experience on Next.js framework

Deep understanding of App Router patterns

Practical handling of form validation + file upload

Structuring reusable components

Debugging build errors related to .next/types

Clean UI design using Tailwind + Headless UI

## Future Improvements
Integrate image upload via Cloudinary or Cloudflare Images

Add search and advanced filtering

Enable pagination alongside infinite scroll
