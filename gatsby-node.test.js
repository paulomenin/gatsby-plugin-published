const { onCreateNode } = require("./gatsby-node");

const mockOptions = {
  frontmatterDateFieldName: "date",
  frontmatterDraftFieldName: "draft",
  visibleFieldName: "visible",
  publishedFieldName: "published",
  timezone: "UTC",
  makeDraftVisible: false,
  validNodes: ["MarkdownRemark", "Mdx"],
};

const mockNode = {
  internal: {
    type: "Mdx",
  },
  frontmatter: {
    date: "2022-05-01",
    draft: false,
  },
};

const mockActions = {
  createNodeField: jest.fn(),
};

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  jest.setSystemTime(new Date("2022-05-02"));
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("onCreateNode function", () => {
  describe("test node types", () => {
    it("should ignore an invalid node type", () => {
      // Given
      const mockedNode = {
        ...mockNode,
        internal: { type: "InvalidType" },
      };

      // When
      onCreateNode({ node: mockedNode, actions: mockActions }, mockOptions);

      // Then
      expect(mockActions.createNodeField).not.toBeCalled();
    });

    it("should process a valid node type", () => {
      // Given

      // When
      onCreateNode({ node: mockNode, actions: mockActions }, mockOptions);

      // Then
      expect(mockActions.createNodeField).toHaveBeenCalledTimes(2);
    });
  });

  describe("test add published field", () => {
    it("should set published to true when node does not have a defined date", () => {
      // Given
      const mockedNode = {
        ...mockNode,
        frontmatter: { date: undefined },
      };

      // When
      onCreateNode({ node: mockedNode, actions: mockActions }, mockOptions);

      // Then
      expect(mockActions.createNodeField).toHaveBeenCalledWith({
        node: mockedNode,
        name: "published",
        value: true,
      });
    });

    it.each`
      date            | description
      ${"2022-04-02"} | ${"is earlier than today"}
      ${"2022-05-02"} | ${"is today"}
    `("should set published to true when date $description", ({ date }) => {
      // Given
      const mockedNode = {
        ...mockNode,
        frontmatter: { date },
      };

      // When
      onCreateNode({ node: mockedNode, actions: mockActions }, mockOptions);

      // Then
      expect(mockActions.createNodeField).toHaveBeenCalledWith({
        node: mockedNode,
        name: "published",
        value: true,
      });
    });

    it("should set published to false when date is in a future date", () => {
      // Given
      const mockedNode = {
        ...mockNode,
        frontmatter: { date: "2022-05-03" },
      };

      // When
      onCreateNode({ node: mockedNode, actions: mockActions }, mockOptions);

      // Then
      expect(mockActions.createNodeField).toHaveBeenCalledWith({
        node: mockedNode,
        name: "published",
        value: false,
      });
    });

    it("should set published to false when draft is explicit defined to true", () => {
      // Given
      const mockedNode = {
        ...mockNode,
        frontmatter: { draft: true },
      };

      // When
      onCreateNode({ node: mockedNode, actions: mockActions }, mockOptions);

      // Then
      expect(mockActions.createNodeField).toHaveBeenCalledWith({
        node: mockedNode,
        name: "published",
        value: false,
      });
    });
  });

  describe("test add visible field", () => {
    it("should set visible to true if published is true", () => {
      // Given
      const mockedNode = {
        ...mockNode,
        frontmatter: { date: undefined },
      };

      // When
      onCreateNode({ node: mockedNode, actions: mockActions }, mockOptions);

      // Then
      expect(mockActions.createNodeField).toHaveBeenCalledWith({
        node: mockedNode,
        name: "visible",
        value: true,
      });
    });

    it("should set visible to false if published is false", () => {
      // Given
      const mockedNode = {
        ...mockNode,
        frontmatter: { date: "2022-05-03" },
      };

      // When
      onCreateNode({ node: mockedNode, actions: mockActions }, mockOptions);

      // Then
      expect(mockActions.createNodeField).toHaveBeenCalledWith({
        node: mockedNode,
        name: "visible",
        value: false,
      });
    });

    it("should set visible to true if published is false but makeDraftVisible is true", () => {
      // Given
      const mockedNode = {
        ...mockNode,
        frontmatter: { date: "2022-05-03" },
      };

      const mockedOptions = {
        ...mockOptions,
        makeDraftVisible: true,
      };

      // When
      onCreateNode({ node: mockedNode, actions: mockActions }, mockedOptions);

      // Then
      expect(mockActions.createNodeField).toHaveBeenCalledWith({
        node: mockedNode,
        name: "visible",
        value: true,
      });
    });
  });
});
