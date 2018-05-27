### There are files that contain or omit required strings

These files violate a pattern match and either omit a required string or
contain invalid strings.

{{#violations}}
```
glob:   {{{rule.glob}}}
string: {{{rule.match}}}
rule:   deny

files:
  {{#files}}
    {{.}}
  {{/files}}
```
{{/violations}}
