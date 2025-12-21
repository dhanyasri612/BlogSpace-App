const { Document, Packer, Paragraph, TextRun } = require("docx");
const fs = require("fs");

const content = fs.readFileSync(__dirname + "/content.txt", "utf8");

// Split into paragraphs by double newlines and build paragraph objects
const paragraphs = content.split(/\n\n+/);
const children = paragraphs.map((p) => {
  const lines = p.split(/\n/);
  const runs = lines.map((line, idx) => {
    const text = idx === lines.length - 1 ? line : line + "\n";
    return new TextRun({ text });
  });
  return new Paragraph({ children: runs });
});

const doc = new Document({
  creator: "BlogSpace Helper",
  title: "Registration Help",
  sections: [{ children }],
});

Packer.toBuffer(doc)
  .then((buffer) => {
    fs.writeFileSync("registration-help.docx", buffer);
    console.log("registration-help.docx created");
  })
  .catch((err) => {
    console.error("Failed to create docx", err);
    process.exit(1);
  });
