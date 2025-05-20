# Carrot Market Clone

## Tools

TypeScript, React, Next.js, Tailwind CSS

### Next.js

I have practiced using Next.js in my other repository that uses custom API to display current popular movies.  
As this project progresses towards the end, I'll be very comfortable using Next.js.

### Tailwind CSS

I had no knowledge of Tailwind CSS but through this project, I was able to understand and learn how to use Tailwind CSS. My beginning commits of this github repo was about me learning Tailwind CSS.

Concept of Modifiers and Responsive Modifiers blew my mind.

### TypeScript & React

TypeScript and React has been used for most of my projects in my github repositories.

## Implemented Features

### Infinite Scrolling

Users can scroll product pages to see products infinitely unless all the listed items are displayed to the screen.

Whenever the span element that says "Load More" is shown to the screen, useEffect is triggered and runs getMoreProduct function which loads more products from the database and display it to the screen.

````const trigger = useRef<HTMLSpanElement>(null); // connects span element
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
````
