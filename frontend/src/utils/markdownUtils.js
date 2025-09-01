import TurndownService from "turndown";
import Showdown from "showdown";
import ReactMarkdown from "react-markdown";

const turndownService = new TurndownService();

turndownService.addRule("underline", {
    filter: "u",
    replacement: (content) => `__${content}__`,
});

const showdownConverter = new Showdown.Converter({
    extensions: [
        () => [
            {
                type: "lang",
                regex: /__(.+?)__/g,
                replace: "<u>$1</u>",
            },
        ],
    ],
});

const MarkdownRenderer = ({ markdown }) => {
    return (
        <div className="prose [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
export const htmlToMarkdown = (html) => turndownService.turndown(html);
export const markdownToHtml = (markdown) => showdownConverter.makeHtml(markdown);