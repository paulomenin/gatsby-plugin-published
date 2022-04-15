# gatsby-plugin-published

Gatsby plugin to add `published` and `visible` fields to nodes.

The `published` field indicates if the node must be published in a Production build.
It is true if the post is not marked as draft and the date of the post is not in a future date.

The `visible` field indicates if the node must be visible. It can be used to filter nodes in queries to generate pages and lists.

These fields can be used to generate builds with or without draft pages to preview before publish pages.

Also it can be used to set a published date on a post to a future date and make that page be published
only when running the build in the future. You can use this like a manual schedule for publishing a post.

Your queries can filter for the visible field to include/exclude pages.

In a production build only pages with the published field set to true will have the visible field true.

In a development build you can use the published field to know if a page is a draft
(value set to false) and preview the result.

## Install

`npm install --save gatsby-plugin-published`

or

`yarn add gatsby-plugin-published`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-published",
      // Default values for options
      options: {
        // Field name on frontmatter to get the published date
        frontmatterDateFieldName: "date",
        // Field name on frontmatter to get the draft state (boolean)
        // Node is considered a draft if value is true
        frontmatterDraftFieldName: "draft",
        // Field name to add into node fields to set the visible state
        visibleFieldName: "visible",
        // Field name to add into node fields to set the published state
        publishedFieldName: "published",
        // Timezone for comparing dates
        timezone: "UTC",
        // Force draft nodes to be visible
        makeDraftVisible: false,
        // Valid nodes, any node type not in this list will be ignored
        validNodes: ["MarkdownRemark", "Mdx"]
      },
    },
  ],
}
```
