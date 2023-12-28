/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type FunctionComponent, useState } from "react";
import { Formik, Form, Field } from "formik";
import { sendFetch, uploadFile } from "../helpers/uploadFile";

interface EnvelopeProps {
  hint?: boolean;
  sending?: boolean;
  from?: string;
  to?: string;
  message?: string;
  image?: string | null;
}

export const Envelope: FunctionComponent<EnvelopeProps> = ({
  hint: hintDefault,
  sending,
  from,
  message,
  image,
}) => {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(hintDefault);
  const [file, setFile] = useState<File | undefined>();
  const [shareContent, setShareContent] = useState("");

  return (
    <div
      className={`envelope${
        open ? " open" : " new cursor-pointer"
      } 3xl:w-[550px] 3xl:max-w-none 3xl:h-[366.66667px] h-[200px] w-[280px] sm:h-[265px] sm:w-[370px] sm:max-w-[380px] lg:h-[300px] lg:w-[450px] lg:max-w-none`}
      onClick={() => {
        setOpen(true);
        setHint(false);
      }}
    >
      <div className="back">
        {hint && (
          <div className="absolute left-1/2 top-1/3 z-10 flex w-full -translate-x-1/2 -translate-y-1/2 animate-pulse flex-col items-center justify-center text-black">
            <p className="font-chi text-2xl font-bold">点击打开</p>
            <p className="font-en text-lg">Click to open</p>
          </div>
        )}
        <div className="letter 3xl:w-[530px] 3xl:h-[346.66667px] h-[195px] w-[260px] px-2 py-1 sm:h-[260px] sm:w-[350px] md:px-4 md:py-3 lg:h-[290px] lg:w-[430px]">
          {/* <h2>XX：</h2>
          <h3>XXXXXXX！</h3>
          <img
            src="https://medibangpaint.com/wp-content/uploads/2021/08/0.png"
            width="50%"
            height="50%"
          /> */}

          {sending ? (
            <Formik<{
              from: string;
              to: string;
              message: string;
            }>
              initialValues={{
                from: "",
                to: "",
                message: "",
              }}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(true);
                alert(JSON.stringify(values, null, 2));
                if (file) {
                  await uploadFile(file).then(async (data) => {
                    console.log("file", file);
                    await sendFetch(
                      values.from,
                      values.to,
                      values.message,
                      `https://ywkl-image-storage.s3.ap-southeast-1.amazonaws.com/${data}`,
                    ).then(async (rt) => {
                      await rt.json().then((share) => {
                        console.log("share", share);
                        setShareContent(share.id);
                        actions.setSubmitting(false);
                        actions.resetForm();
                      });
                    });
                  });
                } else {
                  await sendFetch(
                    values.from,
                    values.to,
                    values.message,
                    "",
                  ).then(async (rt) => {
                    await rt.json().then((share) => {
                      console.log("share", share);
                      setShareContent(share.id);
                      actions.setSubmitting(false);
                      actions.resetForm();
                    });
                  });
                }
              }}
            >
              {shareContent ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <p className="font-chi text-lg font-bold">
                    把这封信交给他/她吧!
                  </p>
                  <p className="font-en">
                    Share this letter to your loved ones!
                  </p>
                  <div className="flex flex-row-reverse gap-1 pt-3">
                    <button
                      className="font-en rounded-2xl bg-green-400 px-7 py-2"
                      type="button"
                      onClick={() =>
                        navigator
                          .share({
                            text: `这是我写给你的一封信! 感谢这一路的伴随 与神同行! 感恩有你! ❤\nHere's a letter from me to you! Thank You for walking with me alongside God in this journey! ❤\n\nhttps://thanksgiving.fgacyc.com/${shareContent} 💌🕊`,
                          })
                          .then(() =>
                            navigator.clipboard
                              .writeText(
                                `这是我写给你的一封信! 感谢这一路的伴随 与神同行! 感恩有你! ❤\nHere's a letter from me to you! Thank You for walking with me alongside God in this journey! ❤\n\nhttps://thanksgiving.fgacyc.com/${shareContent} 💌🕊`,
                              )
                              .then(() => console.log("Copied to clipboard!")),
                          )
                      }
                    >
                      <span className="font-chi font-bold">分享</span> Share
                    </button>
                    <button
                      className="font-en rounded-2xl border-[1px] border-blue-100 bg-blue-200 px-4 py-2 text-black/80"
                      onClick={() => setShareContent("")}
                    >
                      返回 Back
                    </button>
                  </div>
                </div>
              ) : (
                <Form className="flex h-full flex-grow flex-col gap-2 text-xs lg:text-base">
                  <div className="flex flex-row gap-2">
                    <label
                      htmlFor="from"
                      className="font-en 3xl:w-[145px] w-[80px] text-black"
                    >
                      <span className="font-chi font-bold">来自</span> From
                    </label>
                    <Field
                      className="font-chi flex-grow font-bold"
                      name="from"
                      id="from"
                    />
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <label
                      htmlFor="to"
                      className="font-en 3xl:w-[145px] w-[80px] text-black"
                    >
                      <span className="font-chi font-bold">收信者</span> To
                    </label>
                    <Field
                      className="font-chi flex-grow font-bold"
                      name="to"
                      id="to"
                    />
                  </div>
                  <div className="flex flex-grow flex-row gap-x-2">
                    <label
                      htmlFor="message"
                      className="font-en 3xl:w-[145px] w-[80px] text-black"
                    >
                      <span className="font-chi font-bold">内容</span> Message
                    </label>
                    <Field
                      className="font-chi flex-grow resize-none font-bold"
                      name="message"
                      id="message"
                      as="textarea"
                    />
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <div className="3xl:w-[145px] min-w-[80px]" />
                    <input
                      name={"img"}
                      // disabled={isSubmitting}
                      type="file"
                      id="img"
                      onChange={(e) => setFile(e.target.files?.[0])}
                      className={`hidden`}
                      accept="image/*"
                    />
                    {file ? (
                      <label htmlFor="img">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-[75px] object-cover"
                        />
                      </label>
                    ) : (
                      <label
                        htmlFor="img"
                        className="font-en flex-grow cursor-pointer rounded-full bg-white py-1 text-center text-black"
                      >
                        <span className="font-chi font-bold">添加照片</span> Add
                        Pictures
                      </label>
                    )}
                  </div>
                  <button className="font-en 3xl:text-lg bg-gradient-to-br from-[#fcfcfc] to-[#f4f5f5] py-1">
                    <span className="font-chi font-bold">发送</span> Send
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="flex h-full flex-col">
              <p className="font-chi w-full text-center text-xl">
                嘿，想对你说...
              </p>

              <div className="flex h-[calc(100%-60px)] flex-row gap-x-5 p-2">
                {image && (
                  <img
                    src={image}
                    className="h-full w-[130px] object-cover"
                    alt={"image"}
                  />
                )}
                {image && <div className="h-full w-[1px] bg-gray-400" />}
                <div className="w-full overflow-y-scroll">
                  {message
                    ?.split("\n")
                    .map((m) => (
                      <p className="font-chi flex-grow text-xl">{m}</p>
                    ))}
                </div>
              </div>
              <div className="absolute bottom-3 right-5">
                <p className="font-en text-black">
                  <span className="font-chi">来自</span> From: {from}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flap left-flap before:3xl:w-[269.27249px] before:3xl:h-[269.27249px] before:-top-[5px] before:h-[300px] before:w-[300px] before:sm:h-[388.90873px] before:sm:w-[388.90873px] before:lg:h-[275px] before:lg:w-[275px]"></div>
        <div className="flap right-flap before:3xl:w-[269.27249px] before:3xl:h-[269.27249px] before:-top-[5px] before:h-[300px] before:w-[300px] before:sm:h-[388.90873px] before:sm:w-[388.90873px] before:lg:h-[275px] before:lg:w-[275px]"></div>
        <div className="flap bottom-flap before:3xl:w-[388.90873px] before:3xl:h-[388.90873px] before:h-[490px] before:w-[490px] before:rounded-tl-[25px] before:sm:h-[650px] before:sm:w-[650px] before:lg:h-[800px] before:lg:w-[820px] before:lg:rounded-tl-[50px]"></div>
        <div className="flap top-flap before:3xl:w-[388.90873px] before:3xl:h-[388.90873px] before:h-[197px] before:w-[220px] before:sm:h-[263.27249px] before:sm:w-[263.27249px] before:lg:h-[318px] before:lg:w-[318px]"></div>
      </div>
    </div>
  );
};
