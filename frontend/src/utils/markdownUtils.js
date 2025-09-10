import TurndownService from "turndown";
import Showdown from "showdown";
import ReactMarkdown from "react-markdown";

const turndownService = new TurndownService();
const showdownConverter = new Showdown.Converter();

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