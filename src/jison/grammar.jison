
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
"="                   /* skip = */
","                   return ','
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
[A-Z][0-9]+           return 'CELL'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'
"PI"                  return 'PI'
"E"                   return 'E'
"normal"              return 'NORMAL'
"uniform"             return 'UNIFORM'
"poisson"             return 'POISSON'
"exponential"         return 'EXPONENTIAL'
"choose"              return 'CHOOSE'
"mmax"                return 'MMAX'
"min"                 return 'MIN'
"max"                 return 'MAX'
"mean"                return 'MEAN'
p[0-9]+               return 'PN'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

e
    : e '+' e
        {$$ = yy.distributions.plus($1,$3);}
    | e '-' e
        {$$ = yy.distributions.minus($1,$3);}
    | e '*' e
        {$$ = yy.distributions.mul($1,$3);}
    | e '/' e
        {$$ = yy.distributions.div($1,$3);}
    | e '^' e
        {$$ = Math.pow($1, $3);}
    | e '!'
        {{
          $$ = (function fact (n) { return n==0 ? 1 : fact(n-1) * n })($1);
        }}
    | e '%'
        {$$ = $1/100;}
    | '-' e %prec UMINUS
        {$$ = -$2;}
    | '(' e ')'
        {$$ = $2;}
    | CELL
      {$$ = window.values[yytext];}
    | NUMBER
        {$$ = Number(yytext);}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    | NORMAL '(' e ',' e ')'
        {   $$ = new yy.distributions.normal({mean: $3,stddev: $5});}
    | NORMAL '(' e ',' e ',' e ')'
        {   $$ = new yy.distributions.normal({mean: $3,stddev: $5, sampleMin: $7});}
    | NORMAL '(' e ',' e ',' e ',' e ')'
        {   $$ = new yy.distributions.normal({mean: $3,stddev: $5, sampleMin: $7, sampleMax: $9});}
    | UNIFORM '(' e ',' e ')'
        {   $$ = new yy.distributions.uniform({min: $3,max: $5});}
    | POISSON '(' e ')'
        {   $$ = new yy.distributions.poisson({mean: $3});}
    | EXPONENTIAL '(' e ')'
        {   $$ = new yy.distributions.exponential({rate: $3});}
    | CHOOSE '(' e ',' e ')'
        {   $$ = new yy.distributions.choose($3,$5);}
    | MMAX '(' e ',' e ')'
        {   $$ = new yy.distributions.mmax($3,$5);}
    | PN '(' e ')'
        {$$ = yy.distributions.pn($1, $3);}
    | MIN '(' e ')'
        {$$ = yy.distributions.min($3);}
    | MAX '(' e ')'
        {$$ = yy.distributions.max($3);}
    | MEAN '(' e ')'
        {$$ = yy.distributions.mean($3);}
;

