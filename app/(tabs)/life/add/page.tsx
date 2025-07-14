import Input from "@/components/input";
// import { useActionState } from "react";

export default function AddPost() {
    // const [state, action] = useActionState({}, null);
    return (
        <div>
            Add New Post
            {/* <form action={action}> */}
            <form>
                <Input
                    name="title"
                    required
                    placeholder="Title"
                    type="text"
                    // errors={state?.fieldErrors.title}
                ></Input>
                <Input
                    name="description"
                    required
                    placeholder="Description"
                    type="text"
                    // errors={state?.fieldErrors.description}
                ></Input>
            </form>
        </div>
    );
}
