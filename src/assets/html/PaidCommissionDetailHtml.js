import moment from 'moment';
import {waveIcon} from '../base64/waveIcon';

export const PaidCommissionDetailHtmlContent = (userData, transactions) => {
  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            padding: 30px;
            color: #000;
            max-width: 800px;
            margin: 0 auto;
          }

          /* Logo Section */
          .logo-container {
            text-align: center;
            margin-bottom: 40px;
          }
          
          /* Agar aapke paas logo image URL hai to img tag use karein, 
             warna ye text style image jaisa look dega */
          .company-logo-text {
            font-size: 24px;
            color: #d4af37; /* Gold color matching the image */
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 300;
            display: inline-block;
            position: relative;
          }
          
          /* Waveform icon placeholder styling */
          .waveform-icon {
              width: 400px;
              height: auto;
          }

          /* User Info Section */
          .info-container {
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.6;
          }

          .row-split {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .label {
            font-weight: 800; /* Extra bold matching image */
            color: #000;
            margin-right: 5px;
          }

          .value {
            color: #000;
          }

          /* Table Section */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          thead tr {
            background-color: #EDBF60; /* Mustard/Gold Background */
          }

          th {
            text-align: left;
            padding: 12px 15px;
            font-weight: 700;
            color: #000;
            font-size: 15px;
          }

          td {
            padding: 12px 15px;
            font-size: 14px;
            color: #333;
            border: none;
          }

          /* Zebra Striping for rows */
          tbody tr:nth-child(even) {
            background-color: #f4f4f4; /* Light Grey */
          }
          
          tbody tr:nth-child(odd) {
            background-color: #fff; /* White */
          }

          /* Footer Section */
          .footer {
            margin-top: 60px;
            font-size: 12px;
            color: #000;
            text-align: left;
            line-height: 1.4;
          }
            @media print {
            * {
              -webkit-print-color-adjust: exact !important;
            }
          }
        </style>
      </head>

      <body>
        <div class="logo-container">
<span class="company-logo">
  <img src="${waveIcon}" class="waveform-icon" />
</span>        </div>

        <div class="info-container">
          <div class="row-split">
            <div>
              <span class="label">Name:</span>
              <span class="value">${userData?.first_name ?? ''} ${
    userData?.last_name ?? ''
  }</span>
            </div>
            <div>
              <span class="label">Date:</span>
              <span class="value">${moment().format('DD/MM/YYYY') ?? ''} </span>
            </div>
          </div>

          <div style="margin-top: 5px;">
            <span class="label">Email:</span>
            <span class="value">${userData?.email ?? ''}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Transaction Date</th>
              <th>Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            ${
              transactions?.length
                ? transactions
                    .map(
                      item => `
                        <tr>
                          <td>${item?.transaction_date ?? ''}</td>
                          <td>£${item?.amount ?? '0.00'}</td>
                        </tr>
                      `,
                    )
                    .join('')
                : `
                  <tr>
                    <td colspan="2" style="text-align:center; padding: 20px;">No transactions found</td>
                  </tr>
                `
            }
          </tbody>
        </table>

        <div class="footer">
          Dynamite Lifestyle Limited, Registered in Northern Ireland. Registered Office: 51 Hill Street, Belfast, BT1 2LB,<br />
          Registered number: NI644904, VAT No: GB285898328
        </div>
      </body>
    </html>
  `;
};
