import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="footer">
      <div class="container">
        <div class="row between main-footer text-14">
          <div class="columns three">
            <div class="footer-logo">
              <img src="/static/images/logo.svg" alt="Zerodha logo" />
            </div>
            <p class="copyright text-grey">© 2010 - 2026, Zerodha Broking Ltd.</p>
            <p class="copyright text-grey">All rights reserved.</p>
            <ul class="social">
              <li>
                <a target="_blank" rel="noreferrer" href="https://x.com/zerodha">
                  <img src="/static/images/x-twitter.svg" alt="Twitter logo" />
                </a>
              </li>
              <li>
                <a target="_blank" rel="noreferrer" href="https://facebook.com/zerodha.social"><i class="icon-facebook-official"></i></a>
              </li>
              <li>
                <a target="_blank" rel="noreferrer" href="https://instagram.com/zerodhaonline/"><i class="icon-instagram"></i></a>
              </li>
              <li>
                <a target="_blank" rel="noreferrer" href="https://linkedin.com/company/zerodha">
                  <i class="icon-linkedin"></i>
                </a>
              </li>
            </ul>
            <hr />
            <ul class="social">
              <li>
                <a target="_blank" rel="noreferrer" href="https://www.youtube.com/@zerodhaonline">
                  <img class="youtube-logo" src="/static/images/youtube.svg" alt="YouTube logo" />
                </a>
              </li>
              <li>
                <a target="_blank" rel="noreferrer" href="https://whatsapp.com/channel/0029Va8tzF0EquiIIb9j791g">
                  <img class="whatsapp-logo" src="/static/images/whatsapp-logo.svg" alt="WhatsApp logo" />
                </a>
              </li>
              <li>
                <a target="_blank" rel="noreferrer" href="https://t.me/zerodhain">
                  <i class="icon-telegram"></i>
                </a>
              </li>
            </ul>
            <div class="app-badges">
              <a target="_blank" rel="noreferrer" href="https://play.google.com/store/apps/details?id=com.zerodha.kite3">
                <img src="/static/images/google-play-badge-light.svg" alt="Get it on Google Play" />
              </a>
              <a target="_blank" rel="noreferrer" href="https://apps.apple.com/in/app/kite-zerodha/id1449453802">
                <img src="/static/images/appstore-badge-light.svg" alt="Download on the App Store" />
              </a>
            </div>
          </div>
          <div class="columns nine">
            <div class="row between">
              <div class="columns three">
                <ul class="list-style">
                  <li class="nav-head">Account</li>
                  <li><Link to="/signup">Open demat account</Link></li>
                  <li><a href="https://zerodha.com/open-account/minor/">Minor demat account</a></li>
                  <li><a href="https://zerodha.com/open-account/nri/">NRI demat account</a></li>
                  <li><a href="https://zerodha.com/open-account/huf/">HUF demat account</a></li>
                  <li><a href="https://zerodha.com/commodities/">Commodity</a></li>
                  <li><a href="https://zerodha.com/dematerialise/">Dematerialisation</a></li>
                  <li><a href="https://zerodha.com/fund-transfer/">Fund transfer</a></li>
                  <li><a href="https://zerodha.com/mtf/">MTF</a></li>
                </ul>
              </div>
              <div class="columns three">
                <ul class="list-style">
                  <li class="nav-head">Support</li>
                  <li><Link to="/support">Contact us</Link></li>
                  <li><Link to="/support">Support portal</Link></li>
                  <li><a target="_blank" rel="noreferrer" href="https://support.zerodha.com/category/your-zerodha-account/your-profile/ticket-creation/articles/how-do-i-create-a-ticket-at-zerodha">How to file a complaint?</a></li>
                  <li><a target="_blank" rel="noreferrer" href="https://support.zerodha.com/category/your-zerodha-account/your-profile/ticket-creation/articles/track-complaints-or-tickets">Status of your complaints</a></li>
                  <li><Link to="/support">Circular / Bulletin</Link></li>
                  <li><Link to="/support">Z-Connect blog</Link></li>
                  <li><a href="https://zerodha.com/resources/">Downloads</a></li>
                </ul>
              </div>
              <div class="columns three">
                <ul class="list-style">
                  <li class="nav-head">Company</li>
                  <li><Link to="/about">About</Link></li>
                  <li><a href="https://zerodha.com/about/philosophy/">Philosophy</a></li>
                  <li><a href="https://zerodha.com/media/">Press &amp; media</a></li>
                  <li><a href="https://careers.zerodha.com/">Careers</a></li>
                  <li><a href="https://zerodha.com/cares/">Zerodha Cares (CSR)</a></li>
                  <li><a href="https://zerodha.tech/">Zerodha.tech</a></li>
                  <li><a href="https://zerodha.com/open-source/">Open source</a></li>
                  <li><a href="https://zerodha.com/refer/">Referral program</a></li>
                </ul>
              </div>
              <div class="columns three">
                <ul class="list-style">
                  <li class="nav-head">Quick links</li>
                  <li><a href="https://zerodha.com/ipo/">Upcoming IPOs</a></li>
                  <li><Link to="/pricing">Brokerage charges</Link></li>
                  <li><a href="https://zerodha.com/marketintel/holiday-calendar/">Market holidays</a></li>
                  <li><a href="https://zerodha.com/markets/calendar/">Economic calendar</a></li>
                  <li><Link to="/pricing">Calculators</Link></li>
                  <li><Link to="/kite">Kite Platform</Link></li>
                  <li><Link to="/console">Console Portfolio</Link></li>
                  <li><Link to="/coin">Coin Mutual Funds</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row smallprint">
          <p>
            Zerodha Broking Ltd.: Member of NSE, BSE, MCX &amp; MSEI – SEBI Registration no.: INZ000031633 CDSL/NSDL: Depository services through Zerodha Broking Ltd. – SEBI Registration no.: IN-DP-431-2019
            Registered Address: Zerodha Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any complaints pertaining to securities broking please write to complaints@zerodha.com, for DP related to dp@zerodha.com. Please ensure you carefully read the Risk Disclosure Document as prescribed by SEBI | ICF
          </p>
          <p>
            Procedure to file a complaint on <a rel="nofollow" href="https://scores.sebi.gov.in/" target="_blank">SEBI SCORES</a>: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy redressal of the grievances
          </p>
          <p>
            <a rel="nofollow" href="https://smartodr.in/" target="_blank">Smart Online Dispute Resolution</a> | <a href="https://zerodha-common.s3.ap-south-1.amazonaws.com/Downloads-and-resources/Smart%20ODR%20info.pdf" target="_blank">Grievances Redressal Mechanism</a>
          </p>
          <p>
            Investments in securities market are subject to market risks; read all the related documents carefully before investing.
          </p>
          <p>
            Attention investors: 1) Stock brokers can accept securities as margins from clients only by way of pledge in the depository system w.e.f September 01, 2020. 2) Update your e-mail and phone number with your stock broker / depository participant and receive OTP directly from depository on your e-mail and/or mobile number to create pledge. 3) Check your securities / MF / bonds in the consolidated account statement issued by NSDL/CDSL every month.
          </p>
          <p>
            India's largest broker based on networth as per NSE. <a rel="nofollow" href="https://enit.nseindia.com/MemDirWeb/brokerDetailPage_Beta?memID=2516&h_MemType=members&memName=ZERODHA%20BROKING%20LIMITED" target="_blank">NSE broker factsheet</a>
          </p>
          <p>
            "Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers/depository participants. Receive information of your transactions directly from Exchange/Depositories on your mobile/email at the end of the day. Issued in the interest of investors. KYC is one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary (broker, DP, Mutual Fund etc.), you need not undergo the same process again when you approach another intermediary." Dear Investor, if you are subscribing to an IPO, there is no need to issue a cheque. Please write the Bank account number and sign the IPO application form to authorize your bank to make payment in case of allotment. In case of non allotment the funds will remain in your bank account. As a business we don't give stock tips, and have not authorized anyone to trade on behalf of others. If you find anyone claiming to be part of Zerodha and offering such services, please <a href="https://support.zerodha.com/category/your-zerodha-account/your-profile/ticket-creation/articles/how-do-i-place-a-complaint-at-zerodha">create a ticket here</a>.
          </p>
          <p>
            *Customers availing insurance advisory services offered by Ditto (Tacterial Consulting Private Limited | IRDAI Registered Corporate Agent (Composite) License No CA0738) will not have access to the exchange investor grievance redressal forum, SEBI SCORES/ODR, or arbitration mechanism for such products.
          </p>
          <p>Fixed deposit products offered on this platform are third-party products (TPP) and are not Exchange traded products. These are offered through Blostem Fintech Private Limited. Zerodha Broking Limited (SEBI Registration No.: INZ000031633) is acting solely as a distributor for these products. Any disputes arising with respect to such distribution activity will not have access to SEBI SCORES/ODR, Exchange Investor Grievance Redressal Forum, or Arbitration mechanism. Fixed deposits are regulated by the Reserve Bank of India (RBI).</p>
        </div>
        <div class="footer-graveyard-links text-center">
          <ul>
            <li><a rel="nofollow" href="https://nseindia.com">NSE</a></li>
            <li><a rel="nofollow" href="https://www.bseindia.com/">BSE</a></li>
            <li><a rel="nofollow" href="https://www.mcxindia.com/">MCX</a></li>
            <li><a rel="nofollow" href="https://mseindia.com/">MSEI</a></li>
            <li><a href="https://zerodha.com/terms-and-conditions/">Terms &amp; conditions</a></li>
            <li><a href="https://zerodha.com/policies-and-procedures/">Policies &amp; procedures</a></li>
            <li><a href="https://zerodha.com/privacy-policy/">Privacy policy</a></li>
            <li><a href="https://zerodha.com/disclosure/">Disclosure</a></li>
            <li><a href="https://zerodha.com/investor-attention/">For investor's attention</a></li>
            <li><a href="https://zerodha.com/tos/investor-charter/">Investor charter</a></li>
            <li><a href="https://zerodha.com/sitemap/">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
