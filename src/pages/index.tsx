import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Head from "next/head";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { type RouterOutputs, api } from "~/utils/api";

export default function Home() {
  const { data, isLoading } = api.post.getAll.useQuery();

  const { user, isSignedIn } = useUser();

  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Something went wrong</div>;
  }

  type PostWithUser = RouterOutputs["post"]["getAll"][number];
  const PostView = ({ post, author }: PostWithUser) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <img
            src={author.imageUrl}
            alt="Profile picture"
            className="h-12 w-12 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-slate-600">
              @{author.username}{" "}
              <span className="text-sm">
                - {dayjs(post.createdAt).fromNow()}
              </span>
            </span>
            <span>{post.content}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Tweeji</title>
        <meta name="description" content="Twitter but only with emojis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen items-center justify-center py-6">
        <div className="flex h-full w-full flex-col justify-between gap-6 rounded-md border p-6 shadow-xl md:max-w-2xl">
          <div>
            {!isSignedIn && (
              <SignInButton>
                <Button variant={"outline"}>Sign In</Button>
              </SignInButton>
            )}
            {!!isSignedIn && (
              <div className="flex justify-between">
                <SignOutButton>
                  <Button variant={"outline"}>Sign out</Button>
                </SignOutButton>
                <div className="flex items-center gap-4">
                  <UserButton showName />
                </div>
              </div>
            )}
          </div>
          <Separator />
          <div className="flex flex-1 flex-col gap-6">
            {data.map(({ post, author }) => (
              <PostView key={post.id} post={post} author={author} />
            ))}
          </div>
          <Separator />
          <div className="flex w-full gap-6">
            <Input
              disabled={!isSignedIn}
              placeholder="Type your message here."
            />
            <Button disabled={!isSignedIn}>Send</Button>
          </div>
        </div>
      </main>
    </>
  );
}
