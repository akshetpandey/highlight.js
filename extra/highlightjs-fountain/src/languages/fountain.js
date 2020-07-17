/*
Language: Fountain
Author: Akshet Pandey <argetlam.akshet@gmail.com>
Website: https://fountain.io/
Description: Syntax information is available here: https://fountain.io/syntax
Category: markup
*/

export default function(hljs) {
  /*
    https://fountain.io/syntax#section-emphasis
    Text emphasis
    *italics*
    **bold**
    ***bold italics***
    _underline_

    In this way the writer can mix and match and combine bold,
    italics and underlining, as screenwriters often do.

    Examples:
    ```
    From what seems like only INCHES AWAY.  _Steel's face FILLS the *Leupold Mark 4* scope_.

    Steel enters the code on the keypad: **\*9765\***
    ```
  */
  const UNDERLINE = {
    className: 'underline',
    contains: [],
    begin: /_/,
    end: /_/
  };

  const BOLD_ITALICS = {
    className: 'strong hljs-emphasis',
    contains: [],
    begin: /\*\*\*/,
    end: /\*\*\*/
  };

  const BOLD = {
    className: 'strong',
    contains: [],
    begin: /\*\*(?!\*)/,
    end: /\*\*/
  };

  const ITALICS = {
    className: 'emphasis',
    contains: [],
    begin: /\*(?!\*)/,
    end: /\*/
  };

  const CENTERED = {
    className: 'centered',
    contains: [],
    begin: />/,
    end: /</
  };

  UNDERLINE.contains.push(BOLD_ITALICS);
  UNDERLINE.contains.push(BOLD);
  UNDERLINE.contains.push(ITALICS);
  BOLD_ITALICS.contains.push(BOLD);
  BOLD_ITALICS.contains.push(ITALICS);
  BOLD_ITALICS.contains.push(UNDERLINE);
  ITALICS.contains.push(BOLD_ITALICS);
  ITALICS.contains.push(BOLD);
  ITALICS.contains.push(UNDERLINE);
  BOLD.contains.push(BOLD_ITALICS);
  BOLD.contains.push(ITALICS);
  BOLD.contains.push(UNDERLINE);
  CENTERED.contains.push(BOLD_ITALICS);
  CENTERED.contains.push(ITALICS);
  CENTERED.contains.push(UNDERLINE);

  const EMPHASIS = [
    UNDERLINE,
    BOLD_ITALICS,
    ITALICS,
    BOLD,
    CENTERED
  ];

  /*
    https://fountain.io/syntax#section-slug
    A Scene Heading is any line that has a blank line following it,
    and either begins with INT or EXT or similar

    You can "force" a Scene Heading by starting the line with a single period.

    Scene heading prefixes:
    INT
    EXT
    EST
    INT./EXT
    INT/EXT
    I/E

    Scene Headings can optionally be appended with Scene Numbers.
    Scene numbers are any alphanumerics (plus dashes and periods), wrapped in #

    Examples:
    ```
     .SNIPER SCOPE POV
    INT. HOUSE - DAY #1#
    INT. HOUSE - DAY #I-1-A#
    INT. HOUSE - DAY - FLASHBACK (1944) #110A#
    ```
  */
  const FOUNTAIN_HEADING = {
    className: 'title hljs-heading',
    variants: [
      {
        begin: /^[ \t]*(INT|EXT|EST|INT\.\/EXT|INT\/EXT|I\/E)/i,
        end: /\n(?=^\s*$)/,
        excludeEnd: true,
        relevance: 10
      },
      {
        begin: /^[ \t]*\./i,
        end: /\n(?=^\s*$)/,
        excludeEnd: true,
        relevance: 0
      }
    ],
    contains: [
      {
        className: 'symbol hljs-scene-number',
        begin: /#./,
        end: /#/
      }
    ]
  };

  /*
    https://fountain.io/syntax#section-action
    Action, or scene description, is any paragraph that doesn't meet criteria for another element
    You can force an Action element can by preceding it with an exclamation point !
  */
  const FOUNTAIN_ACTION = {
    className: 'regexp hljs-action',
    variants: [
      {
        begin: /^(?=.*[a-z]+(.|\s)*)/,
        end: /^$(?!\s*(.*[a-z]+|!.+))/
      },
      {
        begin: /^!.+/,
        end: /^$(?!\s*(.*[a-z]+|!.+))/
      }
    ],
    contains: [
      EMPHASIS
    ]
  };

  /*
    https://fountain.io/syntax#section-paren

    Parentheticals follow a Character or Dialogue element, and are wrapped in parentheses ().
    Example:
    ```
    STEEL
    (starting the engine)
    So much for retirement!
    ```
  */
  const FOUNTAIN_PARENTHETICAL = {
    className: 'regexp hljs-parenthetical',
    begin: /^[ \t]*\(/,
    end: /\)/,
    contains: []
  };

  /*
    https://fountain.io/syntax#section-dialogue
    Dialogue is any text following a Character or Parenthetical element.
    Manual line breaks are allowed in Dialogue

    Exampples:
    ```
    SANBORN
    A good 'ole boy. You know, loves the Army, blood runs green. Country boy. Seems solid.

    DAN
    Then let's retire them.
    _Permanently_.
    ```
  */
  const FOUNTAIN_DIALOGUE = {
    className: 'string hljs-dialogue',
    begin: /^[ \t]*(?=[^\n(])/,
    end: /\n((?=^$)|(?=^[ \t]*\())/,
    excludeEnd: true,
    // contains: EMPHASIS.concat([FOUNTAIN_PARENTHETICAL]),
    contains: EMPHASIS,
    endsWithParent: true
  };

  /*
    https://fountain.io/syntax#section-character
    A Character element is any line entirely in uppercase,
    with one empty line before it and without an empty line after it.

    If you want to indent a Character element with tabs or spaces,
    you can, but it is not necessary

    "Character Extensions"--the parenthetical notations that follow a character
    name on the same line--may be in uppercase or lowercase

    Character names must include at least one alphabetical character.
    "R2D2" works, but "23" does not.

    You can force a Character element by preceding it with the "at" symbol `@`

    Examples:
    ```
    STEEL
    The man's a myth!

    MOM (O. S.)
    Luke! Come down for supper!

    HANS (on the radio)
    What was it you said?

    @McCLANE
    Yippie ki-yay! I got my lower-case C back!
    ```
  */
  const FOUNTAIN_CHARACTER_REGEX = /(?<=^\s*$\s)^[ \t]*[A-Z0-9 ]*[A-Z ]+[A-Z0-9 ]*(?=$|\(.*\)$)(?!\^$)/;
  const FOUNTAIN_CHARACTER_FORCED_REGEX = /(?<=^\s*$\s)^[ \t]*@[A-Z0-9a-z ]*[A-Za-z ]+[A-Z0-9a-z ]*(?=$|\()/;
  const FOUNTAIN_CHARACTER = {
    className: 'symbol hljs-character',
    variants: [
      {
        begin: FOUNTAIN_CHARACTER_REGEX,
        end: /$/
      },
      {
        begin: FOUNTAIN_CHARACTER_FORCED_REGEX,
        end: /$/
      }
    ],
    contains: [
      {
        className: 'subst hljs-character-extensions',
        begin: /\(/,
        end: /\)/
      },
      FOUNTAIN_DIALOGUE
    ]
  };

  const FOUNTAIN_DIALOGUE_BLOCK = {
    className: 'dialog-block',
    variants: [
      {
        begin: FOUNTAIN_CHARACTER_REGEX,
        // 'on:begin': (matchData, response) => {
        //   console.log('FOUNTAIN_DIALOGUE_BLOCK begin', matchData);
        // },
        end: /^$/
      },
      {
        begin: FOUNTAIN_CHARACTER_FORCED_REGEX,
        end: /^$/
      }
    ],
    returnBegin: true,
    contains: [
      FOUNTAIN_CHARACTER,
      FOUNTAIN_PARENTHETICAL,
      FOUNTAIN_DIALOGUE
    ]
  };

  const FOUNTAIN_DUAL_CHARACTER_REGEX = /(?<=^\s*$\s)^[ \t]*[A-Z0-9 ]*[A-Z ]+[A-Z0-9 ]*(?=\^$|\((?=.*\^$))/;
  const FOUNTAIN_DUAL_CHARACTER_FORCED_REGEX = /(?<=^\s*$\s)^[ \t]*@[A-Z0-9a-z ]*[A-Za-z ]+[A-Z0-9a-z ]*(?=\^$|\((?=.*\^$))/;
  const FOUNTAIN_DUAL_DIALOGUE_BLOCK = {
    className: 'dual-dialog-block',
    variants: [
      {
        begin: FOUNTAIN_DUAL_CHARACTER_REGEX,
        // 'on:begin': (matchData, response) => {
        //   console.log('FOUNTAIN_DIALOGUE_BLOCK begin', matchData);
        // },
        end: /^$/
      },
      {
        begin: FOUNTAIN_DUAL_CHARACTER_FORCED_REGEX,
        end: /^$/
      }
    ],
    returnBegin: true,
    contains: [
      FOUNTAIN_CHARACTER,
      FOUNTAIN_PARENTHETICAL,
      FOUNTAIN_DIALOGUE
    ]
  };

  /*
    https://fountain.io/syntax#section-trans
    The requirements for Transition elements are:

    Uppercase
    Preceded by and followed by an empty line
    Ending in TO:

    You can force any line to be a transition by beginning it with a greater-than symbol >

    Examples:
    ```
    Jack begins to argue vociferously in Vietnamese (?), But mercifully we...

    CUT TO:

    EXT. BRICK'S POOL - DAY

    Brick and Steel regard one another.  A job well done.

    > Burn to White.
    ```
  */
  const FOUNTAIN_TRANSITION = {
    className: 'regexp hljs-transition',
    variants: [
      {
        begin: /^[ \t]*(?=[^\n]*TO:[ \t]*$)/,
        end: /TO:[ \t]*$/
      },
      {
        begin: /^[ \t]*>(?!$|.*<)/,
        end: /$/
      }
    ],
    contains: []
  };

  return {
    name: 'Fountain',
    aliases: ['fountain', 'spmd'],
    case_insensitive: false,
    contains: [
      FOUNTAIN_HEADING,
      FOUNTAIN_DUAL_DIALOGUE_BLOCK,
      FOUNTAIN_DIALOGUE_BLOCK,
      FOUNTAIN_TRANSITION,
      FOUNTAIN_ACTION,
      EMPHASIS,
      hljs.COMMENT(/\/\*/, /\*\//)
    ]
  };
}
