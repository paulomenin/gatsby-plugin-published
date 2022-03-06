const moment = require("moment-timezone")

const defaultOptions = {
  frontmatterDateFieldName: "date",
  frontmatterDraftFieldName: "draft",
  visibleFieldName: "visible",
  publishedFieldName: "published",
  timezone: "UTC",
  makeDraftVisible: process.env.NODE_ENV !== "production",
}

exports.onCreateNode = ({ node, actions }, pluginOptions) => {
  const { createNodeField } = actions

  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  if (node.internal.type !== "MarkdownRemark") {
    return
  }

  let isPublished = true

  const dateValue = node.frontmatter[options.frontmatterDateFieldName]
  
  if (dateValue) {
    // Compare if node is in a future date
    const now = moment().tz(options.timezone)
    const nodeTime = moment.tz(dateValue, options.timezone)
    isPublished = nodeTime.isSameOrBefore(now)
  }

  // Is not published if explicitly set as draft
  const draftValue = node.frontmatter[options.frontmatterDraftFieldName]
  
  if (draftValue === true) {
    isPublished = false
  }

  createNodeField({
    node,
    name: options.publishedFieldName,
    value: isPublished,
  })

  // All nodes are visible if makeDraftVisible option is true
  const isVisible = options.makeDraftVisible === true || isPublished

  createNodeField({
    node,
    name: options.visibleFieldName,
    value: isVisible,
  })
}
