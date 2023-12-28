/* eslint-disable @next/next/no-img-element */
import { Envelope } from "@/components/Envelope";

function MainPage() {
  return (
    <main className="flex h-[100dvh] w-screen flex-col items-center bg-gray-800 py-12 2xl:py-16">
      <img
        src="/TG_Title.png"
        className="w-[170px] object-cover lg:w-[230px] 2xl:w-[270px]"
      />
      <Envelope hint sending />
      <div className="3xl:bottom-20 absolute bottom-[12.5%] left-1/2 flex w-full -translate-x-1/2 flex-col text-xl text-white lg:bottom-10">
        <p className="font-chi w-full text-center text-lg lg:text-4xl">
          写一段感恩的话语，
          <br />
          再把它转发给你想感恩的人。
        </p>

        <p className="font-en w-[75%] self-center text-center text-sm lg:text-lg">
          Write a thanksgiving message to someone and forward it.
        </p>
      </div>
    </main>
  );
}

export default MainPage;
