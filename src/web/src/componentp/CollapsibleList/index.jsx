import "./index.scss";
import React, { useState, useRef, useEffect } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import ComCardBox from "../ComCardBox";
import RenderHTML from "../RenderHTML";

import imgCode1 from "./assets/imgCode1.png";
import imgCode2 from "./assets/imgCode2.png";
import imgCode3 from "./assets/imgCode3.png";
import imgCode4 from "./assets/imgCode4.png";

// 列表组件
const CollapsibleList = () => {
  const [openIndex, setOpenIndex] = useState(null); // 用于跟踪当前展开的索引
  const cardRefs = useRef([]); // 引用每个 ComCardBox 的 DOM 节点
  // 示例数据，content 是一个 React 节点数组，支持多个组件和 HTML 元素
  const listItems = [
    {
      title: "Lucky Lottery UniquNess",
      content: [
        <div className="collapsible-list-box ">
          <div className="collapsible-list-title mt-[16px]">
            Decentralized Blockchain Lottery:
          </div>
          <div className="collapsible-list-content mt-[16px]">
          Lucky Lottery is a player-centric, decentralized online lottery,
            powered by  smart contracts on{" "}
            <a href="https://internetcomputer.org/">Internet Computer</a>,
            ensuring transparency and fairness. Lucky Lottery will facilitate
            traceable, player-directed charitable giving, enhancing the social
            impact of lotteries.  With blockchain technology at its core, Lucky
            Lottery has the potential to significantly evolve the global lottery
            industry.
          </div>
          <div className="collapsible-list-title mt-[40px]">
            Decentralization:
          </div>
          <div className="collapsible-list-content mt-[16px]">
            <strong> Player-Centric：</strong>Traditional lotteries, often run
            or regulated by governments, typically return only 30-40% of ticket
            sales to players, with the rest going towards government projects
            and operating costs. Lucky Lottery flips this model, returning a
            minimum of 90% of ticket funding directly to the players, ensuring
            the prize pool is shared primarily among the players. The remaining
            10% covers essential operating expenses like wages, marketing, and
            future sales commissions. Should this 10% generate a profit, it will
            be transparently distributed to crypto token holders via smart
            contract.
          </div>
          <div className="collapsible-list-content mt-[16px]">
            <strong> No-Dealer System:</strong>Lucky Lottery operates on a
            purely chance-based, no-dealer system, eliminating the possibility
            of manipulated win rates and preventing the implementation of
            addictive gaming techniques.
          </div>
          <div className="collapsible-list-content mt-[16px]">
            <strong> Inclusive Ownership:</strong>Lucky Lottery is committed to
            inclusive ownership and community engagement. Our future plans
            include: offering crypto tokens to all users, enabling them to
            become stakeholders and participate in project governance.
          </div>
          <div className="collapsible-list-title mt-[40px]">Blockchain</div>
          <div className=" mt-[16px]">
            <strong>Enhanced Transparency and Trust: </strong>
          </div>
          <div className="collapsible-list-content  ">
            Blockchain's immutable ledger ensures that all transactions, from
            ticket purchases to draws, are recorded transparently and cannot be
            altered. Blockchain's decentralized nature makes it resistant to
            hacking and fraud. Smart contracts can automate various lottery
            functions, reducing the risk of human error or manipulation.
          </div>
          <div className=" mt-[16px]">
            <strong>Provably Fair Draw: </strong>Our ticket number generation is
            powered by{" "}
            <a
              target="_blank"
              href="https://internetcomputer.org/docs/current/developer-docs/smart-contracts/advanced-features/randomness"
            >
              {" "}
              the Internet Computer Randomness
            </a>
            . A unique seed is generated on every user’s play request by IC
            Randomness service and then each instant win number is drawn based
            on the unique seed. Details of our methodology, sample code and test
            reports are demonstrated in the technical session below. 
          </div>
          <div className=" mt-[16px]">
            <strong>Lower Transaction Fees: </strong>Internet Computer
            outperforms both traditional payment methods and the Ethereum
            network in terms of speed and transaction costs, making it ideal for
            Lucky Lottery's frequent, small-value transactions.
          </div>
          <div className=" mt-[16px]">
            <strong>Full Disclosure: </strong>Every draw's complete history is
            securely stored on-chain and made public upon completion.
            Additionally, each lottery batch's wallet address is disclosed,
            enabling independent verification of all transactions on the IC
            network on <a>IC Transaction. </a>
          </div>
          <div className=" mt-[16px]">
            <strong>Global Accessibility: </strong>With blockchain, Lucky
            Lottery breaks down geographical barriers, enabling anyone with an
            internet connection and a crypto wallet to participate, opening up a
            truly global player base.
          </div>
          <div className="collapsible-list-title mt-[24px]"></div>
        </div>,
      ],
    },
    {
      title: "Your Easy Guide to Play",
      content: [
        <div className="collapsible-list-box ">
          <div className="collapsible-list-content mt-[16px]">
            <strong>Welcome to Lucky Lottery (WL)! </strong>
            Playing the lottery has never been easier or more transparent.
            Follow these simple steps to start playing and winning today:
          </div>
          <div>
            <ul style={{ listStyle: "auto" }}>
              <li>
                Sign up or Sign in with{" "}
                <a href="https://identity.ic0.app/">Internet Identity </a>{" "}
              </li>
              <li>
                Deposit Funds:
                <ul>
                  <li>
                    Head over to the <strong>MONEY</strong> tab.
                  </li>
                  <li>Deposit ICP into your account address on IC</li>
                </ul>
              </li>
              <li>
                Play the Lottery:
                <ul>
                  <li>
                    Ready to try your luck? Navigate to the{" "}
                    <strong>PLAY</strong> tab.
                  </li>
                  <li>
                    Simply click the <strong>“Play”</strong> button, and we’ll
                    instantly generate a random number for you.
                  </li>
                  <li>
                    Within seconds, you’ll see your number and the results on
                    the same screen—no waiting, just instant excitement!
                  </li>
                </ul>
              </li>
              <li>
                Withdraw Your Winnings:
                <ul>
                  <li>
                    You can withdraw your <strong>deposit and earnings</strong>{" "}
                    anytime.
                  </li>
                  <li>
                    Go back to the <strong>MONEY</strong> tab and click on the{" "}
                    <strong>“Withdraw”</strong> section.
                  </li>
                  <li>
                    Follow the easy instructions to transfer your balance to
                    your third party ICP Address.
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="collapsible-list-content  ">
            You can review all your deposits, withdrawals, and game history on
            the <strong>RECORD</strong> page.
          </div>
          <div className="collapsible-list-title mt-[24px]"></div>
        </div>,
      ],
    },
    {
      title: "FAQs",
      content: [
        <div className="collapsible-list-box ">
          <div className="collapsible-list-title mt-[16px]">
            1. How does WL ensure fairness in the lottery?
          </div>
          <div className="collapsible-list-content mt-[16px]">
            WL ensures fairness by integrating provably fair technology into our
            smart contracts. This means that the entire lottery process is
            automated and based on true randomness, determined by advanced
            mathematical and cryptographic algorithms. Winners are selected
            without any human intervention or bias, ensuring every player has an
            equal chance to win. Additionally, key details such as the batch
            number, win rate, and payout rate are fully disclosed on the{" "}
            <strong>PLAY</strong>
            page for complete transparency.
          </div>
          <div className="collapsible-list-title mt-[16px]">
            2. How does WL maintain transparency and privacy?
          </div>
          <div className="collapsible-list-content mt-[16px]">
            WL combines transparency with privacy in an innovative way. Every
            transaction, whether it’s the purchase of lottery tickets or the
            distribution of winnings, is recorded on the blockchain, making it
            publicly accessible and verifiable. At the same time, each player
            remains completely anonymous, ensuring that your personal
            information and participation in the lottery are kept confidential.
          </div>
          <div className="collapsible-list-title mt-[16px]">
            3. What payment Method do you support?
          </div>
          <div className="collapsible-list-content mt-[16px]">
            We currently offer convenient ICP token deposit and withdrawal
            options through any crypto exchange or wallet. In the future, we're
            committed to expanding our supported cryptocurrencies and networks,
            giving our players more choices.
          </div>
          <div className="collapsible-list-title mt-[16px]">
            4. Why am I charged a transaction fee when sending tokens?
          </div>
          <div className="collapsible-list-content mt-[16px]">
            Token transfers are processed by smart contract which incurs a
            mandatory fee. The fees for ICP is 0.0001.
          </div>
          <div className="collapsible-list-title mt-[16px]">
            5. How quickly can I play and see the results?
          </div>
          <div className="collapsible-list-content mt-[16px]">
            WL offers instant play and win capabilities thanks to the speed of
            the IC blockchain. After you click <strong>“PLAY”</strong>, your
            ticket number is generated in seconds, and the results are displayed
            immediately on the same screen. No waiting—just instant excitement!
          </div>
          <div className="collapsible-list-title mt-[16px]">
            6. What percentage of the ticket revenue is paid out to winners?
          </div>
          <div className="collapsible-list-content mt-[16px]">
            WL is committed to providing high payouts to its players. We
            guarantee that at least 90% of the ticket revenue from each batch is
            paid out to winners. This generous payout rate ensures that more of
            the money goes back to you, the players.
          </div>
          <div className="collapsible-list-title mt-[16px]">
            7. How can I deposit and withdraw my winnings?
          </div>
          <div className="collapsible-list-content mt-[16px]">
            When a user is login with Internet Identity, a deposit account is
            automatically created. To deposit funds, navigate to the{" "}
            <strong> MONEY</strong> tab and transfer your chosen cryptocurrency
            to your IC network address generated by WL. If you win, you can
            withdraw your earnings at any time by going back to the{" "}
            <strong>MONEY</strong> tab and following the instructions under the
            Withdraw section. Your complete transaction history is available on
            the <strong>RECORD</strong> page, ensuring full transparency.
          </div>
          <div className="collapsible-list-title mt-[24px]"></div>
        </div>,
      ],
    },
    {
      title: "Technical Session",
      content: [
        <RenderHTML
          htmlContent={`<div class="h2">1. Random Algorithm</div>`}
        />,
        <RenderHTML
          htmlContent={`<div class="content mt-[16px]">For each play, Lucky Lottery will generate a unique, random ticket number. This random number is generated using a secure, consistent, and unpredictable algorithm based on the Internet Computer (IC) chain's random mechanism.</div>`}
        />,
        <RenderHTML
          htmlContent={`<div class="content mt-[16px]"><strong> The ticket number generation process involves the following steps: </strong></div>`}
        />,
        <RenderHTML
          htmlContent={`<div class="content  ">
            <ul style='list-style: auto;'>
             <li>
             Seed Generation: The system produces a private, random 32-byte seed. Each user receives a different seed, ensuring that each play results in a unique ticket number.
            </li> 
            <li>
            Ticket Number Generation: Using the seed, the system generates a ticket number within the specified range. If the generated number has already been drawn, the system finds the next available number.
            </li>
            </ul>
            </div>`}
        />,
        <RenderHTML
          htmlContent={`<div class="h2">2. Transparency and Fairness:</div>`}
        />,
        <RenderHTML
          htmlContent={`<div class="content mt-[16px]">
          The IC-based random algorithm guarantees that the winning tickets drawn by users are unpredictable and completely transparent. This ensures a fair and equitable lottery experience.
          </div>`}
        />,
        <RenderHTML
          htmlContent={`<div class="h2">3. Draw Test Results (4 batches of 1,000 draws each) :</div>`}
        />,

        <RenderHTML
          htmlContent={`<div class="content mt-[16px] mb-[8px]">1. Consistent Win Rate</div>`}
        />,

        <PhotoProvider>
          <PhotoView src={`${imgCode1}`}>
            <img src={`${imgCode1}`} alt="" />
          </PhotoView>
        </PhotoProvider>,

        // <RenderHTML
        //   htmlContent={`<div class="content">
        //       <img src="${imgCode1}" alt="Dynamic Example" style="width: 100%; height: auto;" />
        //     </div>`}
        // />,

        <RenderHTML
          htmlContent={`<div class="content mt-[16px] mb-[8px]">2. Comparison of 4 Batches</div>`}
        />,
        <PhotoProvider>
          <PhotoView src={`${imgCode2}`}>
            <img src={`${imgCode2}`} alt="" />
          </PhotoView>
        </PhotoProvider>,

        <RenderHTML
          htmlContent={`<div class="content mt-[16px] mb-[8px]">3. Batch 1 Details</div>`}
        />,

        <PhotoProvider>
          <PhotoView src={`${imgCode3}`}>
            <img src={`${imgCode3}`} alt="" />
          </PhotoView>
        </PhotoProvider>,
        <RenderHTML
          htmlContent={`<div class="content mt-[16px] mb-[8px]">4. Sample Code</div>`}
        />,

        <PhotoProvider>
          <PhotoView src={`${imgCode4}`}>
            <img src={`${imgCode4}`} alt="" />
          </PhotoView>
        </PhotoProvider>,
      ],
    },
  ];

  // 处理点击事件，展开或收起内容
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index); // 切换当前索引状态
  };

  useEffect(() => {
    // 监听documentElement高度的变化
    const observer = new ResizeObserver(() => {
      const currentOpenElement = document.querySelector('div.item-opened');
      if (!currentOpenElement) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      };
      const distTop = currentOpenElement.offsetTop;
      window.scrollTo({
        top: distTop,
        behavior: "smooth",
      });
    });

    
    observer.observe(document.documentElement);

    return () => {
      observer.disconnect(); // 清理监听
    };
  }, []); 
  return (
    <div className="collapsible-list-v2">
      {listItems.map((item, index) => (
        <div
          id={`item-${index}`} // 给每个元素添加唯一的ID
          key={`itemccc-${index}`}
          className={`  ${
            index !== 0 ? "mt-[16px]" : "" // 为每个非首标题添加40px的顶部间距
          } ${openIndex === index ? "item-opened" : ""}`} // 根据当前展开状态添加类名
          ref={(el) => (cardRefs.current[index] = el)} // 记录每个 ComCardBox 的引用
        >
          {/* 使用标题组件 */}
          <ComCardBox
            key={`itemc-${index}`}
            isUp={openIndex === index}
            title={item.title}
            handleClick={() => handleToggle(index)}
          ></ComCardBox>
          {/* 动态内容高度部分 */}
          <CollapsibleContent
            key={`itemco-${index}`}
            isOpen={openIndex === index}
          >
            {item.content}
          </CollapsibleContent>
        </div>
      ))}
    </div>
  );
};

// 内容组件，处理内容的自适应高度
const CollapsibleContent = ({ children, isOpen }) => {
  const contentRef = useRef(null); // 创建引用来获取内容的实际高度
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight); // 如果内容打开，设置为内容的实际高度
    } else {
      setHeight(0); // 如果内容关闭，设置高度为0
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      style={{ maxHeight: `${height}px` }} // 使用动态高度
      className={`overflow-hidden transition-max-height duration-500 ease-in-out`}
    >
      <div className="">{children}</div>
    </div>
  );
};

export default CollapsibleList;
