export const getHtml = (name, link) => `<div><i>
    <p>Hi there!</p>
    <p>${name} has incited you to Assetize. Please press the link & follow the instructions to create an account: <a href=${link}>${link}</a>.</p>
  </i></div>`;

export const getText = (name, link) =>
  `Hi there! 
  ${name} has incited you to Assetize. Please press the link & follow the instructions to create an account:${link}.`;

export const getSubject = (name) =>
  `[Action required] You've been invited to Assetize by ${name}!`;
